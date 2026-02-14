
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, PageOrientation, HeightRule } from "docx";
import saveAs from "file-saver";
import * as XLSX from "xlsx";
import { MathTest, QuestionType, MatrixRow, TestConfig } from "../types";

/**
 * Xuất Ma trận đặc tả ra file Excel (.xlsx)
 */
export function exportMatrixToExcel(matrix: MatrixRow[], config: TestConfig) {
  try {
    const subjectUpper = config.subject.toUpperCase();
    const aoaData: any[][] = [
      ["MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ"],
      [config.title.toUpperCase() + " - MÔN " + subjectUpper + " LỚP 5"],
      ["", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["Mạch kiến thức, kĩ năng", "Số câu và số điểm", "Mức 1", "", "Mức 2", "", "Mức 3", "", "Mức 4", "", "TỔNG", "", ""],
      ["", "", "TNKQ", "TL", "TNKQ", "TL", "TNKQ", "TL", "TNKQ", "TL", "TNKQ", "TL", "Cộng"]
    ];

    matrix.forEach((row) => {
      aoaData.push([
        row.topic,
        "Số câu",
        row.l1_mcq || 0, row.l1_cr || 0,
        row.l2_mcq || 0, row.l2_cr || 0,
        row.l3_mcq || 0, row.l3_cr || 0,
        row.l4_mcq || 0, row.l4_cr || 0,
        (row.l1_mcq + row.l2_mcq + row.l3_mcq + row.l4_mcq),
        (row.l1_cr + row.l2_cr + row.l3_cr + row.l4_cr),
        (row.l1_mcq + row.l1_cr + row.l2_mcq + row.l2_cr + row.l3_mcq + row.l3_cr + row.l4_mcq + row.l4_cr)
      ]);
      aoaData.push([
        "",
        "Số điểm",
        row.l1_mcq_pts || 0, row.l1_cr_pts || 0,
        row.l2_mcq_pts || 0, row.l2_cr_pts || 0,
        row.l3_mcq_pts || 0, row.l3_cr_pts || 0,
        row.l4_mcq_pts || 0, row.l4_cr_pts || 0,
        (row.l1_mcq_pts + row.l2_mcq_pts + row.l3_mcq_pts + row.l4_mcq_pts),
        (row.l1_cr_pts + row.l2_cr_pts + row.l3_cr_pts + row.l4_cr_pts),
        (row.l1_mcq_pts + row.l1_cr_pts + row.l2_mcq_pts + row.l2_cr_pts + row.l3_mcq_pts + row.l3_cr_pts + row.l4_mcq_pts + row.l4_cr_pts)
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(aoaData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ma trận");
    const safeSubject = config.subject.replace(/\s+/g, '_');
    XLSX.writeFile(workbook, `MaTran_${safeSubject}_TT27.xlsx`);
  } catch (error) {
    console.error("Lỗi khi xuất Excel:", error);
    alert("Không thể xuất file Excel. Vui lòng thử lại.");
  }
}

/**
 * Xuất Ma trận đặc tả ra file Word (.docx)
 */
export async function exportMatrixToWord(matrix: MatrixRow[], config: TestConfig) {
  const subjectName = config.subject.toUpperCase();
  const createCell = (text: string | number, bold = false, rowSpan = 1, colSpan = 1, alignment: any = AlignmentType.CENTER) => {
    return new TableCell({
      children: [new Paragraph({ 
        children: [new TextRun({ text: text.toString(), bold, size: 20 })],
        alignment: alignment
      })],
      rowSpan,
      columnSpan: colSpan,
      verticalAlign: VerticalAlign.CENTER,
    });
  };

  const doc = new Document({
    sections: [{
      properties: { page: { size: { width: 16838, height: 11906, orientation: PageOrientation.LANDSCAPE } } },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ", bold: true, size: 28 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `${config.title.toUpperCase()} - MÔN ${subjectName} LỚP 5`, bold: true, size: 24 })],
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                createCell("Mạch kiến thức, kĩ năng", true, 2, 1),
                createCell("Số câu và số điểm", true, 2, 1),
                createCell("Mức 1", true, 1, 2),
                createCell("Mức 2", true, 1, 2),
                createCell("Mức 3", true, 1, 2),
                createCell("Mức 4", true, 1, 2),
                createCell("TỔNG", true, 1, 3),
              ]
            }),
            new TableRow({
              children: [
                createCell("TNKQ", true), createCell("TL", true),
                createCell("TNKQ", true), createCell("TL", true),
                createCell("TNKQ", true), createCell("TL", true),
                createCell("TNKQ", true), createCell("TL", true),
                createCell("TNKQ", true), createCell("TL", true), createCell("Tổng cộng", true),
              ]
            }),
            ...matrix.flatMap(row => [
              new TableRow({
                children: [
                  createCell(row.topic, false, 2, 1, AlignmentType.LEFT),
                  createCell("Số câu", false),
                  createCell(row.l1_mcq || "", false), createCell(row.l1_cr || "", false),
                  createCell(row.l2_mcq || "", false), createCell(row.l2_cr || "", false),
                  createCell(row.l3_mcq || "", false), createCell(row.l3_cr || "", false),
                  createCell(row.l4_mcq || "", false), createCell(row.l4_cr || "", false),
                  createCell(row.l1_mcq + row.l2_mcq + row.l3_mcq + row.l4_mcq, true),
                  createCell(row.l1_cr + row.l2_cr + row.l3_cr + row.l4_cr, true),
                  createCell(row.l1_mcq + row.l1_cr + row.l2_mcq + row.l2_cr + row.l3_mcq + row.l3_cr + row.l4_mcq + row.l4_cr, true),
                ]
              }),
              new TableRow({
                children: [
                  createCell("Số điểm", false),
                  createCell(row.l1_mcq_pts || "", false), createCell(row.l1_cr_pts || "", false),
                  createCell(row.l2_mcq_pts || "", false), createCell(row.l2_cr_pts || "", false),
                  createCell(row.l3_mcq_pts || "", false), createCell(row.l3_cr_pts || "", false),
                  createCell(row.l4_mcq_pts || "", false), createCell(row.l4_cr_pts || "", false),
                  createCell(row.l1_mcq_pts + row.l2_mcq_pts + row.l3_mcq_pts + row.l4_mcq_pts, true),
                  createCell(row.l1_cr_pts + row.l2_cr_pts + row.l3_cr_pts + row.l4_cr_pts, true),
                  createCell(row.l1_mcq_pts + row.l1_cr_pts + row.l2_mcq_pts + row.l2_cr_pts + row.l3_mcq_pts + row.l3_cr_pts + row.l4_mcq_pts + row.l4_cr_pts, true),
                ]
              }),
            ])
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const safeSubject = config.subject.replace(/\s+/g, '_');
  saveAs(blob, `Ma_Tran_${safeSubject}_Lop5.docx`);
}

/**
 * Xuất đề thi ra file Word (.docx)
 */
export async function exportTestToWord(test: MathTest) {
  const isTiengViet = test.config.subject === 'Tiếng Việt';
  const mcqs = test.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
  const crs = test.questions.filter(q => q.type === QuestionType.CONSTRUCTIVE_RESPONSE);

  const children: any[] = [
    // Header section
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6 },
        bottom: { style: BorderStyle.SINGLE, size: 6 },
        left: { style: BorderStyle.SINGLE, size: 6 },
        right: { style: BorderStyle.SINGLE, size: 6 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 6 },
        insideVertical: { style: BorderStyle.SINGLE, size: 6 },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ children: [new TextRun({ text: "Trường: ...........................................", size: 22 })] }),
                new Paragraph({ children: [new TextRun({ text: "Họ và tên: .......................................", size: 22 })] }),
                new Paragraph({ children: [new TextRun({ text: "Lớp: .................................................", size: 22 })] }),
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: { left: 100 },
            }),
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: test.config.title.toUpperCase(), bold: true, size: 22 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NĂM HỌC 2024 - 2025", bold: true, size: 22 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `MÔN: ${test.config.subject.toUpperCase()}`, bold: true, size: 22 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Thời gian: ${test.config.duration} phút`, italics: true, size: 20 })] }),
              ],
              verticalAlign: VerticalAlign.CENTER,
            }),
          ],
        }),
      ],
    }),

    // Score table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        bottom: { style: BorderStyle.SINGLE, size: 6 },
        left: { style: BorderStyle.SINGLE, size: 6 },
        right: { style: BorderStyle.SINGLE, size: 6 },
        insideVertical: { style: BorderStyle.SINGLE, size: 6 },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Điểm", bold: true, size: 22 })] })],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Lời phê của thầy cô giáo", bold: true, size: 22 })] })],
            }),
          ],
        }),
        new TableRow({
          height: { value: 1000, rule: HeightRule.ATLEAST },
          children: [
            new TableCell({ children: [] }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: ".....................................................................................................................", size: 20, color: "888888" })], spacing: { before: 100 } }),
                new Paragraph({ children: [new TextRun({ text: ".....................................................................................................................", size: 20, color: "888888" })] }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 300 } }),
  ];

  if (isTiengViet) {
    const reading = test.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE || (q.type === QuestionType.CONSTRUCTIVE_RESPONSE && !q.content.toLowerCase().includes('viết')));
    const writing = test.questions.filter(q => q.type === QuestionType.CONSTRUCTIVE_RESPONSE && q.content.toLowerCase().includes('viết'));

    children.push(
      new Paragraph({ children: [new TextRun({ text: "A. KIỂM TRA ĐỌC (10 điểm)", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "I. Đọc thành tiếng (3 điểm): (Học sinh bốc thăm bài đọc và trả lời câu hỏi)", size: 22 })], indent: { left: 400 } }),
      new Paragraph({ children: [new TextRun({ text: "II. Đọc hiểu kết hợp kiểm tra kiến thức Tiếng Việt (7 điểm):", size: 22 })], indent: { left: 400 }, spacing: { after: 200 } }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[ĐOẠN VĂN/BÀI THƠ ĐỌC HIỂU]", italics: true, color: "666666" })], spacing: { after: 400 } })
    );

    reading.forEach((q, idx) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `Câu ${idx + 1}: `, bold: true }), new TextRun({ text: `${q.content} (${q.points}đ)` })], spacing: { before: 200 } }));
      if (q.options) {
        children.push(new Paragraph({ children: q.options.map((opt, oIdx) => new TextRun({ text: `${String.fromCharCode(65+oIdx)}. ${opt}\t\t` })), indent: { left: 400 } }));
      }
    });

    children.push(
      new Paragraph({ children: [new TextRun({ text: "B. KIỂM TRA VIẾT (10 điểm)", bold: true, size: 24 })], spacing: { before: 400 } }),
      ...writing.map(q => new Paragraph({ children: [new TextRun({ text: q.content, size: 24 })], indent: { left: 400 }, spacing: { after: 400 } })),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BÀI LÀM", bold: true })] })
    );
  } else {
    // Math, Science etc.
    children.push(new Paragraph({ children: [new TextRun({ text: "I. PHẦN TRẮC NGHIỆM", bold: true, size: 24 })], spacing: { after: 200 } }));
    mcqs.forEach((q, idx) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `Câu ${idx + 1}: `, bold: true }), new TextRun({ text: `${q.content} (${q.points}đ)` })], spacing: { before: 200 } }));
      children.push(new Paragraph({ children: q.options?.map((opt, oIdx) => new TextRun({ text: `${String.fromCharCode(65+oIdx)}. ${opt}\t\t` })) || [], indent: { left: 400 } }));
    });

    children.push(new Paragraph({ children: [new TextRun({ text: "II. PHẦN TỰ LUẬN", bold: true, size: 24 })], spacing: { before: 400, after: 200 } }));
    crs.forEach((q, idx) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `Câu ${mcqs.length + idx + 1}: `, bold: true }), new TextRun({ text: `${q.content} (${q.points}đ)` })], spacing: { before: 200 } }));
      for(let i=0; i<4; i++) children.push(new Paragraph({ children: [new TextRun({ text: "..................................................................................................................................................................", color: "CCCCCC", size: 18 })] }));
    });
  }

  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "--- HẾT ---", italics: true })], spacing: { before: 600 } }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `De_Thi_${test.config.subject}_${test.versionName}.docx`);
}

/**
 * Xuất đáp án ra file Word (.docx)
 */
export async function exportAnswersToWord(test: MathTest) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `ĐÁP ÁN & HƯỚNG DẪN CHẤM - MÔN ${test.config.subject.toUpperCase()}`, bold: true, size: 28 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: test.versionName.toUpperCase(), bold: true, size: 24 })], spacing: { after: 400 } }),
        ...test.questions.map((q, idx) => [
          new Paragraph({
            children: [new TextRun({ text: `Câu ${idx+1}: `, bold: true }), new TextRun({ text: q.answer })],
            spacing: { before: 200 }
          }),
          q.explanation ? new Paragraph({ children: [new TextRun({ text: `Ghi chú: ${q.explanation}`, italics: true, color: "666666" })] }) : new Paragraph({ text: "" })
        ]).flat()
      ]
    }]
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Dap_An_${test.config.subject}_${test.versionName}.docx`);
}
