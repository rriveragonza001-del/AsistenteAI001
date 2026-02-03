
export enum FileCategory {
  PROGRAMACION = 'PROGRAMACION',
  REPORTE = 'REPORTE',
  BITACORA = 'BITACORA'
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  category: FileCategory;
  uploadDate: Date;
  ownerId: string;
  contentBase64?: string;
  mimeType: string;
  status: 'pending' | 'analyzed';
  tags: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'Baja' | 'Media' | 'Alta';
  status: 'Pendiente' | 'En Progreso' | 'Completado';
  createdAt: string;
  recurring?: boolean;
}

export interface AnalysisResult {
  summary: string;
  goodPoints: string[];
  badPoints: string[];
  improvements: string[];
  impactScore: number;
  comparativeInsights: string;
  suggestedActions: ActionItem[];
}

export interface AppState {
  files: UploadedFile[];
  team: TeamMember[];
  selectedView: 'dashboard' | 'schedules' | 'reports' | 'assistant' | 'actions';
  actionItems: ActionItem[];
  history: AnalysisResult[];
}
