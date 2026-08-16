/** Current explorations — lightweight "what I'm poking at right now" cards. */
export interface Exploration {
  id: string;
  label: string;
  note?: string;
}

export const explorations: Exploration[] = [];
