// Points to confirm with the teacher (or the slide) before the exam.
// The app currently uses the answer in "appUses"; change it here once the teacher confirms.
export type ConfirmItem = {
  id: string;
  topic: string;
  title: string;
  source: string; // which slide / PDF page
  slideSays: string; // what the slide shows
  appUses: string; // what the app currently uses
  question: string; // what to ask the teacher
};

export const confirmItems: Record<string, ConfirmItem[]> = {
  aoc: [
    {
      id: "c-sop-1",
      topic: "2.3 K-map",
      title: "SOP of F(X,Y,Z) = Σ(1,3,6,7)",
      source: "Unit 2 slide (K-map SOP example)",
      slideSays: "Groups ko YZ + XY likha hai.",
      appUses: "X'Z + XY (minterm 1 ko X'Z cover karta hai; YZ + XY minterm 1 cover nahi karta).",
      question: "Exam mein Σ(1,3,6,7) ka minimal SOP kya likhna hai: YZ + XY ya X'Z + XY?",
    },
    {
      id: "c-sop-2",
      topic: "2.3 K-map",
      title: "SOP of F = Σ(0,4,6,7)",
      source: "Unit 2 slide (K-map examples)",
      slideSays: "Slide ke hisaab se answer alag ho sakta hai (check karna hai).",
      appUses: "Y'Z' + XY (Y'Z' minterms 0 aur 4 cover karta hai, XY minterms 6 aur 7).",
      question: "Σ(0,4,6,7) ka minimal SOP teacher kya bata raha hai: Y'Z' + XY?",
    },
    {
      id: "c-mux-1",
      topic: "3.x MUX",
      title: "4×1 MUX select line convention",
      source: "Unit 3 slide (4×1 MUX truth table)",
      slideSays: "Table mein S0 pehle likha hai (S0 ko MSB maana gaya hai).",
      appUses: "Standard convention: S1 MSB. Isliye S1S0 = 10 par I2 select hota hai.",
      question: "Exam mein MUX select line ka convention kaunsa chalega: S0 MSB ya S1 MSB?",
    },
    {
      id: "c-tff-1",
      topic: "Flip-flop",
      title: "T flip-flop table notation",
      source: "Unit 2 slide (T flip-flop)",
      slideSays: "Table mein \"1 (Q')\" aur \"0 (Q)\" likha hai.",
      appUses: "T=1 par toggle (Q'), T=0 par hold (Q).",
      question: "Exam mein T flip-flop table ki notation kaise likhni hai (Q' / Q ya Q(t+1) = ...)?",
    },
    {
      id: "c-selopr-1",
      topic: "4.4 Control word",
      title: "Control word ke bits (SELOPR)",
      source: "Unit 4 slide (control word layout)",
      slideSays: "Slide mein SELOPR ka 5-bit wala box hai.",
      appUses: "Control word 14 bits: SEL A (3) + SEL B (3) + SELOPR (5) + SEL D (3).",
      question: "Exam mein control word kitne bits ka maanna hai, aur SELOPR 5 bits ka hai?",
    },
    {
      id: "c-reg-1",
      topic: "4.2 Registers",
      title: "Kitne general registers hain: 7 ya 8?",
      source: "Unit 4 slides (general register slide aur bus slide)",
      slideSays: "General register slide mein CPU ke 7 registers likhe hain, bus slide mein 8 registers dikhte hain (PC, AR, IR, TR, DR, AC, INPR, OUTR).",
      appUses: "Bus slide wali list (8 registers) use ki gayi hai.",
      question: "Exam mein 'general registers' ki sankhya 7 maani jayegi ya 8?",
    },
  ],
  maths: [],
};
