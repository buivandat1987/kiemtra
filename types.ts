
export enum DifficultyLevel {
  LEVEL_1 = 'Mức 1', // Nhận biết
  LEVEL_2 = 'Mức 2', // Thông hiểu
  LEVEL_3 = 'Mức 3', // Vận dụng
  LEVEL_4 = 'Mức 4', // Vận dụng sáng tạo
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'Trắc nghiệm',
  CONSTRUCTIVE_RESPONSE = 'Tự luận',
}

export type Subject = 'Toán' | 'Tiếng Việt' | 'Lịch sử và Địa lí' | 'Khoa học' | 'Tin học' | 'Công nghệ';

export interface Question {
  id: string;
  type: QuestionType;
  level: DifficultyLevel;
  content: string;
  options?: string[];
  answer: string;
  explanation?: string;
  points: number;
}

export interface TestConfig {
  title: string;
  subject: Subject;
  duration: number;
  grade: number;
  semester: 'Giữa kì 1' | 'Cuối kì 1' | 'Giữa kì 2' | 'Cuối kì 2';
  topics: string[];
  levelDistribution: {
    [key in DifficultyLevel]: number;
  };
  totalPoints: number;
  questionCount: number;
  testCount: number;
}

export interface MatrixRow {
  topic: string;
  l1_mcq: number;
  l1_mcq_pts: number;
  l1_cr: number;
  l1_cr_pts: number;
  l2_mcq: number;
  l2_mcq_pts: number;
  l2_cr: number;
  l2_cr_pts: number;
  l3_mcq: number;
  l3_mcq_pts: number;
  l3_cr: number;
  l3_cr_pts: number;
  l4_mcq: number;
  l4_mcq_pts: number;
  l4_cr: number;
  l4_cr_pts: number;
}

export interface MathTest {
  id: string;
  versionName: string;
  config: TestConfig;
  questions: Question[];
  matrix: MatrixRow[];
  createdAt: string;
}
