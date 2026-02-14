
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { TestConfig, MatrixRow, Question } from "../types";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiWithRetry(ai: any, params: any, maxRetries = 3) {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Sử dụng model flash để có quota cao hơn và tốc độ nhanh hơn
      const response = await ai.models.generateContent(params);
      if (!response || !response.text) {
        throw new Error("Phản hồi từ AI trống. Vui lòng thử lại.");
      }
      return response;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || String(error);
      
      // Nếu gặp lỗi giới hạn (429) hoặc lỗi máy chủ (500, 503)
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("500") || errorMsg.includes("503")) {
        // Chờ đợi lâu hơn sau mỗi lần thử (Exponential backoff)
        const waitTime = (i + 1) * 5000; 
        console.warn(`Đang thử lại lần ${i + 1} sau ${waitTime}ms do lỗi hạn mức...`);
        await wait(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateTestMatrix(config: TestConfig): Promise<MatrixRow[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Hãy thiết kế MA TRẬN ĐỀ KIỂM TRA môn ${config.subject} lớp 5 (Thông tư 27):
  - Tiêu đề: ${config.title}
  - Mạch kiến thức/Chủ điểm: ${config.topics.join(", ")}
  - Tổng số câu: ${config.questionCount}
  - Phân bổ mức độ: Mức 1 (${config.levelDistribution["Mức 1"]}%), Mức 2 (${config.levelDistribution["Mức 2"]}%), Mức 3 (${config.levelDistribution["Mức 3"]}%), Mức 4 (${config.levelDistribution["Mức 4"]}%)

  Yêu cầu quan trọng:
  1. Phân chia số câu Trắc nghiệm (mcq) và Tự luận (cr) cân đối.
  2. Tổng điểm của tất cả các câu (mcq + cr) BẮT BUỘC phải bằng 10.
  3. Trả về đúng định dạng JSON mảng MatrixRow.`;

  const response = await callGeminiWithRetry(ai, {
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT + `\nNhiệm vụ: Lập ma trận đặc tả.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            l1_mcq: { type: Type.INTEGER }, l1_mcq_pts: { type: Type.NUMBER },
            l1_cr: { type: Type.INTEGER }, l1_cr_pts: { type: Type.NUMBER },
            l2_mcq: { type: Type.INTEGER }, l2_mcq_pts: { type: Type.NUMBER },
            l2_cr: { type: Type.INTEGER }, l2_cr_pts: { type: Type.NUMBER },
            l3_mcq: { type: Type.INTEGER }, l3_mcq_pts: { type: Type.NUMBER },
            l3_cr: { type: Type.INTEGER }, l3_cr_pts: { type: Type.NUMBER },
            l4_mcq: { type: Type.INTEGER }, l4_mcq_pts: { type: Type.NUMBER },
            l4_cr: { type: Type.INTEGER }, l4_cr_pts: { type: Type.NUMBER }
          },
          required: ["topic", "l1_mcq", "l1_mcq_pts", "l1_cr", "l1_cr_pts", "l2_mcq", "l2_mcq_pts", "l2_cr", "l2_cr_pts", "l3_mcq", "l3_mcq_pts", "l3_cr", "l3_cr_pts", "l4_mcq", "l4_mcq_pts", "l4_cr", "l4_cr_pts"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Lỗi parse JSON ma trận:", response.text);
    throw new Error("AI phản hồi định dạng không hợp lệ. Vui lòng thử lại.");
  }
}

export async function generateQuestionsFromMatrix(matrix: MatrixRow[], config: TestConfig, versionIndex: number): Promise<Question[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Dựa trên ma trận: ${JSON.stringify(matrix)}, hãy soạn đề thi môn ${config.subject} (Bộ đề số ${versionIndex + 1}).
  
  Yêu cầu bắt buộc:
  1. ${config.subject === 'Tiếng Việt' ? 'Phần Đọc hiểu: Chọn ngữ liệu là một câu chuyện ngắn hoặc bài thơ ý nghĩa. Các câu hỏi phải khai thác nội dung này.' : 'Các câu hỏi phải bám sát thực tế, số liệu logic.'}
  2. Tổng điểm của tất cả các câu hỏi trong danh sách trả về phải bằng chính xác 10.0 điểm.
  3. Nội dung câu hỏi phải khác biệt hoàn toàn với các yêu cầu trước đó.
  4. Trả về JSON mảng Question.`;

  const response = await callGeminiWithRetry(ai, {
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT + `\nNhiệm vụ: Soạn nội dung câu hỏi chi tiết. Chú ý tính chính xác của đáp án.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["Trắc nghiệm", "Tự luận"] },
            level: { type: Type.STRING, enum: ["Mức 1", "Mức 2", "Mức 3", "Mức 4"] },
            content: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            points: { type: Type.NUMBER }
          },
          required: ["id", "type", "level", "content", "answer", "points"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Lỗi parse JSON câu hỏi:", response.text);
    throw new Error("AI phản hồi nội dung không hợp lệ. Vui lòng thử lại.");
  }
}
