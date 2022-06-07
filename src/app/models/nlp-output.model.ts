import { INlpInput } from './nlp-input.model';

export interface INlpOutput {
    student1: INlpInput,
    student2: INlpInput,
    similarityRate: number
}