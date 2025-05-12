// ~/types/project.ts
import type { Timestamp } from 'firebase/firestore';
export interface ProjectData {
	name: string;
	client: string;
	startDate: string;
	endDate: string;
	isFavorite?: boolean;
}

export interface Project extends ProjectData {
	id: string;
}
