import { NextRequest, NextResponse } from "next/server";

interface RiskFlag {
  severity: "red" | "amber";
  title: string;
  why: string;
  rewrite: string;
}

const STUB_FLAGS: RiskFlag[] = [
  {
    severity: "red",
    title: "Unlimited Liability",
    why: "You're personally liable for any damages with no cap. One mistake could bankrupt you.",
    rewrite: 'Add: "Contractor\'s liability shall be limited to the total fees paid under this agreement, except in cases of gross negligence or willful misconduct."',
  },
  {
    severity: "red",
    title: "No Payment Terms",
    why: "Missing payment schedule and terms leaves you vulnerable to delayed or withheld payment.",
    rewrite: 'Add: "Client shall pay invoices within 30 days of receipt. Late payments accrue 1.5% monthly interest. Work may be paused after 45 days of non-payment."',
  },
  {
    severity: "amber",
    title: "Vague Scope of Work",
    why: "Unclear deliverables invite scope creep and disputes about what's included.",
    rewrite: 'Replace vague terms with: "Deliverables include: [specific list]. Any additional work requires a written change order with agreed pricing."',
  },
  {
    severity: "amber",
    title: "Missing Termination Clause",
    why: "No exit strategy locks you into a bad relationship and makes disputes messier.",
    rewrite: 'Add: "Either party may terminate with 30 days written notice. Client pays for work completed through termination date."',
  },
  {
    severity: "red",
    title: "Broad IP Assignment",
    why: "You're giving away rights to all work, including your pre-existing tools and future work.",
    rewrite: 'Revise to: "Client owns work product created specifically for this project. Contractor retains rights to pre-existing materials, general knowledge, and reusable components."',
  },
  {
    severity: "amber",
    title: "No Confidentiality Protection",
    why: "Client can freely share your proprietary methods and confidential information.",
    rewrite: 'Add: "Both parties agree to keep confidential information secret for 3 years after contract end, except as required by law."',
  },
];

async function analyzeWithOpenAI(contract: string): Promise<RiskFlag[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return STUB_FLAGS;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a contract analysis expert for freelancers. Analyze contracts and identify risks.
            
Return ONLY valid JSON array with this exact structure:
[
  {
    "severity": "red" or "amber",
    "title": "Brief risk name",
    "why": "One sentence why this matters to the freelancer",
    "rewrite": "Specific suggested clause to add or modify"
  }
]

Focus on: payment terms, liability, IP rights, scope creep, termination, confidentiality.
Red = major financial/legal risk. Amber = important but less severe.
Be specific and actionable. No markdown, just JSON array.`,
          },
          {
            role: "user",
            content: `Analyze this freelance contract:\n\n${contract}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status);
      return STUB_FLAGS;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return STUB_FLAGS;
    }

    const parsed = JSON.parse(content.trim());
    return Array.isArray(parsed) ? parsed : STUB_FLAGS;
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    return STUB_FLAGS;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { contract } = await request.json();

    if (!contract || typeof contract !== "string") {
      return NextResponse.json(
        { error: "Contract text is required" },
        { status: 400 }
      );
    }

    const flags = await analyzeWithOpenAI(contract);

    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
