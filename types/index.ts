export interface Plot {
  id: string;
  title: string;
  premise: string;
  genre: string;
  chapters: Chapter[];
  characters: Character[];
  settings: Setting[];
  themes: string[];
  conflicts: string[];
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  scenes: string[];
  pacing: string;
  wordCount: number;
  keyEvents: string[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  traits: string[];
  motivation: string;
  arc: string;
  biography?: string;
}

export interface Setting {
  id: string;
  name: string;
  description: string;
  location: string;
  timeperiod: string;
  atmosphere: string;
  significance: string;
}
