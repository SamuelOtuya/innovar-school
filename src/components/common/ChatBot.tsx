import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const CONTACT = {
  phones: ["0720 658 818", "0101 400 530", "0795 636 384"],
  email: "info@innovar.com",
  whatsapp: "254720658818",
};

const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  "Hello Innovar, I would like to make an enquiry.",
)}`;

const quickQuestions = [
  "What does Innovar School offer?",
  "Which Institute courses are available?",
  "How do I apply?",
  "Where are you located?",
  "How much are the fees?",
  "How can I contact you?",
];

const welcomeMessage: Message = {
  id: 0,
  sender: "bot",
  text: "Hello! Welcome to Innovar. I'm your virtual assistant. I can help you find information about Innovar International School, Innovar Institute, admissions, programmes and contact details. How can I help you today?",
};

function getBotReply(question: string): string {
  const text = question.toLowerCase().trim();

  const has = (...keywords: string[]) =>
    keywords.some((keyword) => text.includes(keyword));

  // Contact details
  if (
    has("contact", "phone", "telephone", "call", "email", "number", "whatsapp")
  ) {
    return (
      "You can contact Innovar using:\n\n" +
      "Phone: 0720 658 818 / 0101 400 530 / 0795 636 384\n" +
      "Email: info@innovar.com\n\n" +
      "You can also visit the Contact Us page or use the WhatsApp button below."
    );
  }

  // Location
  if (
    has(
      "location",
      "located",
      "where are",
      "address",
      "directions",
      "find you",
      "campus",
    )
  ) {
    return (
      "Innovar International School is located along " +
      "the Kisumu–Kakamega Highway in Kakamega, Kenya.\n\n" +
      "Please contact the school for the exact campus " +
      "directions before travelling."
    );
  }

  // Fees
  if (
    has("fee", "fees", "tuition", "cost", "price", "payment", "scholarship")
  ) {
    return (
      "Fees depend on the academic level or training " +
      "programme you are interested in.\n\n" +
      "For current fees, payment arrangements and " +
      "any available financial support, please contact " +
      "Innovar directly:\n\n" +
      "Phone: 0720 658 818 / 0101 400 530 / 0795 636 384\n" +
      "Email: info@innovar.com"
    );
  }

  // Admissions
  if (
    has(
      "apply",
      "application",
      "admission",
      "enrol",
      "enroll",
      "register",
      "join",
      "intake",
    )
  ) {
    return (
      "Innovar has two admissions pathways:\n\n" +
      "1. Innovar International School — Kindergarten, " +
      "Primary, Lower Secondary and IGCSE.\n\n" +
      "2. Innovar Institute — technical and digital skills training.\n\n" +
      "Visit the Admissions page to explore the process, " +
      "then contact the admissions team to confirm " +
      "availability, requirements and application arrangements."
    );
  }

  // Boarding
  if (has("boarding", "day school", "hostel", "residential", "accommodation")) {
    return (
      "Innovar International School offers day and " +
      "boarding arrangements.\n\n" +
      "Please contact admissions to confirm the " +
      "options available for your child's year group."
    );
  }

  // School curriculum
  if (
    has(
      "cambridge",
      "edexcel",
      "igcse",
      "curriculum",
      "kindergarten",
      "primary",
      "secondary",
      "year group",
      "school offer",
      "school programme",
      "school program",
    )
  ) {
    return (
      "Innovar International School provides international " +
      "education pathways from Kindergarten through IGCSE.\n\n" +
      "The academic stages include:\n" +
      "• Kindergarten — Nursery and Reception\n" +
      "• Primary — Years 1–6\n" +
      "• Lower Secondary — Years 7–9\n" +
      "• IGCSE — Years 10–11\n\n" +
      "The school describes its academic pathways as " +
      "Cambridge and Pearson Edexcel. Contact the " +
      "school to confirm subjects and qualification options."
    );
  }

  // Institute
  if (
    has(
      "institute",
      "technical",
      "vocational",
      "digital",
      "coding",
      "programming",
      "web development",
      "networking",
      "cybersecurity",
      "cyber security",
      "it course",
      "computer course",
    )
  ) {
    return (
      "Innovar Institute focuses on technical and " +
      "digital skills development.\n\n" +
      "Training areas include:\n" +
      "• Information Technology\n" +
      "• Computer Programming\n" +
      "• Web Development\n" +
      "• Computer Networking\n" +
      "• Cybersecurity\n\n" +
      "Visit the Innovar Institute or Courses page " +
      "to explore published programmes. Contact the " +
      "institute for current availability and requirements."
    );
  }

  // Co-curricular activities
  if (
    has(
      "sport",
      "football",
      "soccer",
      "basketball",
      "chess",
      "club",
      "student life",
      "activity",
      "activities",
      "swimming",
      "karate",
      "skating",
    )
  ) {
    return (
      "Innovar International School includes a range " +
      "of co-curricular opportunities such as soccer, " +
      "basketball, chess, scouting, karate, skating, " +
      "swimming, Model United Nations and World Scholars activities.\n\n" +
      "Visit the Student Life page to learn more."
    );
  }

  // Practical learning
  if (has("practical", "hands-on", "hands on", "project", "training")) {
    return (
      "Innovar Institute emphasises technical and " +
      "digital skills, with learning intended to " +
      "connect knowledge to practical applications.\n\n" +
      "For details of practical sessions, equipment " +
      "and specific programme arrangements, contact the institute."
    );
  }

  // General courses
  if (
    has("course", "courses", "program", "programmes", "programs", "subjects")
  ) {
    return (
      "Innovar offers two main learning pathways:\n\n" +
      "Innovar International School: Kindergarten, " +
      "Primary, Lower Secondary and IGCSE.\n\n" +
      "Innovar Institute: IT, programming, web development, " +
      "networking and cybersecurity training areas.\n\n" +
      "Please visit the relevant page for more information."
    );
  }

  // Greetings
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening)[!.\s]*$/.test(
      text,
    )
  ) {
    return (
      "Hello! Welcome to Innovar. I can help with " +
      "school academics, institute programmes, " +
      "admissions, fees, location and contact information. " +
      "What would you like to know?"
    );
  }

  return (
    "Thank you for your question. I can provide " +
    "general information about Innovar International " +
    "School and Innovar Institute, but I may not have " +
    "the specific answer you're looking for.\n\n" +
    "Please contact our team for assistance:\n" +
    "Phone: 0720 658 818 / 0101 400 530 / 0795 636 384\n" +
    "Email: info@innovar.com"
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextIdRef = useRef(1);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function sendMessage(message?: string) {
    const messageText = (message ?? input).trim();

    if (!messageText) return;

    const userId = nextIdRef.current++;
    const botId = nextIdRef.current++;

    setMessages((previous) => [
      ...previous,
      {
        id: userId,
        sender: "user",
        text: messageText,
      },
      {
        id: botId,
        sender: "bot",
        text: getBotReply(messageText),
      },
    ]);

    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Innovar virtual assistant"
          className="fixed bottom-5 right-4 z-50 flex items-center gap-3 rounded-full bg-[#542080] px-4 py-3 text-white shadow-[0_12px_35px_rgba(84,32,128,0.3)] transition-all hover:-translate-y-1 hover:bg-[#3C1461] sm:bottom-7 sm:right-7 sm:px-5"
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F5BE20] text-[#101A44]">
            <MessageCircle size={24} />

            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#542080] bg-emerald-400" />
          </span>

          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-extrabold">Ask Innovar</span>

            <span className="block text-xs text-white/75">
              Virtual Assistant
            </span>
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <section
          role="dialog"
          aria-label="Innovar Virtual Assistant"
          className="fixed bottom-3 right-3 z-50 flex h-[min(620px,calc(100dvh-24px))] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_70px_rgba(16,26,68,0.25)] sm:bottom-7 sm:right-7"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-[#101A44] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5BE20] text-[#101A44]">
                <Bot size={25} />
              </div>

              <div>
                <h3 className="text-sm font-extrabold">Innovar Assistant</h3>

                <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
                  <span className="h-2 w-2 rounded-full bg-[#F5BE20]" />
                  Automated website help
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
            >
              <X size={21} />
            </button>
          </div>

          {/* Intro strip */}
          <div className="shrink-0 border-b border-[#F0E9F8] bg-[#F8F4FC] px-5 py-3">
            <p className="mb-2 text-xs font-extrabold text-[#101A44]">
              How can we help you today?
            </p>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {[
                "School Academics",
                "Institute Courses",
                "Admissions",
                "Contact Details",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-[11px] text-slate-600"
                >
                  <CheckCircle2 size={13} className="shrink-0 text-[#542080]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#F8F9FE] p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-[13px] leading-6 ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-[#542080] text-white"
                      : "rounded-bl-sm border border-slate-100 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick questions */}
            <div className="space-y-2 pt-2">
              <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Suggested Questions
              </p>

              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="rounded-full border border-[#542080]/15 bg-white px-3 py-2 text-left text-[11px] font-semibold text-[#542080] transition-colors hover:border-[#542080] hover:bg-[#F1EBFA]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp */}
          <div className="shrink-0 border-t border-slate-100 bg-white px-3 pt-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#16834A] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#116838]"
            >
              <MessageCircle size={17} />
              Continue on WhatsApp
              <ArrowUpRight size={15} />
            </a>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 gap-2 bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              aria-label="Your question"
              maxLength={500}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#101A44] outline-none transition-colors placeholder:text-slate-400 focus:border-[#542080] focus:ring-2 focus:ring-[#542080]/10"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5BE20] text-[#101A44] transition-colors hover:bg-[#FFD34D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={19} />
            </button>
          </form>

          <div className="shrink-0 bg-white px-4 pb-3 text-center">
            <p className="text-[10px] text-slate-400">
              Automated responses · Confirm important details with Innovar
            </p>
          </div>
        </section>
      )}
    </>
  );
}
