import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    TrendingUp,
    Microscope,
    Gauge,
    ShieldCheck,
    GitBranch,
    Sparkles,
} from "lucide-react";

import PublicLayout from "@/layouts/PublicLayout";
import Section from "@/components/common/Section";
import { Container, Eyebrow} from "@/components/common/Card";
import Button from "@/components/common/Button";
import FeatureCard from "@/components/dashboard/FeatureCard";
import WorkflowStep from "@/components/dashboard/WorkflowStep";
import PipelineVisual from "@/components/landing/PipelineVisual";


const features = [
    {
        icon: Microscope,
        title: "Novelty Assessment",
        description:
            "Evaluate how unique a research idea is by comparing it with existing literature across multiple dimensions.",
    },
    {
        icon: Gauge,
        title: "Saturation Analysis",
        description:
            "Measure the research activity and competition within a domain to determine whether a topic is emerging or already saturated.",
    },
    {
        icon: TrendingUp,
        title: "Trend Analysis",
        description:
            "Analyze publication patterns and topic evolution to identify emerging research directions and future opportunities.",
    },
    {
        icon: GitBranch,
        title: "Gap discovery",
        description:
            "Identify open challenges, limitations, and unexplored opportunities from the retrieved scientific literature.",
    },
    {
        icon: ShieldCheck,
        title: "Evidence-Based Evaluation",
        description:
            "Every analysis is supported by relevant scientific publications, ensuring transparent and explainable recommendations.",
    },
    {
        icon: Sparkles,
        title: "Research Opportunity Score",
        description:
            "Combine novelty, trends, saturation, and research gaps into a unified score that helps prioritize promising research ideas.",
    },
];

export default function Landing() {
    return (
        <PublicLayout>
            {/* ============================== HERO ============================== */}
            <section className="relative overflow-hidden border-b border-border">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsl(var(--brand)/0.14),transparent)]" />

                <Container className="relative grid grid-cols-1 gap-14 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Eyebrow className="mb-5 text-xl sm:text-xl font-semibold tracking-wide">
                            Research Intelligence &amp; Opportunity Discovery
                        </Eyebrow>

                        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
                            Evaluate your research idea
                            <span className="text-brand"> before you begin.</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                            RIOD analyzes a research idea using scientific literature and AI to evaluate
                            its novelty, research gaps, trends, saturation, and potential impact through
                            an explainable decision-support framework.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link to="/analyze">
                                <Button size="lg">
                                    Analyze a research idea <ArrowRight size={16} />
                                </Button>
                            </Link>
                            <a href="#pipeline">
                                <Button variant="secondary" size="lg">
                                    How it works
                                </Button>
                            </a>
                        </div>

                       
                    </motion.div>

                </Container>
            </section>
            
            {/* ============================== PIPELINE ============================== */}
            <Section
                id="pipeline"
                eyebrow="How it works"
                title="Research Analysis Pipeline"
                subtitle="RIOD follows a structured pipeline that transforms a research idea into an evidence-based evaluation by combining literature retrieval, AI analysis, and explainable scoring."
            >
                {/* Workflow Steps */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <WorkflowStep
                        index={1}
                        title="Describe the Idea"
                        description="Provide a research title and description. Optionally attach a reference PDF to support your idea."
                    />

                    <WorkflowStep
                        index={2}
                        title="AI Analysis Pipeline"
                        description="RIOD understands the idea, retrieves relevant literature, and performs novelty, trend, saturation, and research gap analysis using the ROIF framework."
                    />

                    <WorkflowStep
                        index={3}
                        title="Evidence-Based Report"
                        description="Generate an explainable report containing research scores, supporting literature, recommendations, and refined research directions."
                    />
                </div>

                {/* Pipeline Diagram */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="mt-12"
                >
                    <PipelineVisual />
                </motion.div>
            </Section>
                    {/* ============================== FEATURES ============================== */}
            <Section
                id="contributions"
                eyebrow="Core Features"
                title="Comprehensive Research Intelligence"
                subtitle="Combines multiple research analysis capabilities into a unified platform, providing researchers with evidence-based insights for informed decision-making."
                className="bg-surface/60"
            >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <FeatureCard key={f.title} {...f} />
                    ))}
                </div>
            </Section>
        </PublicLayout>
    );
}
