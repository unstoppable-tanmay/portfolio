"use client";
import { TechStackTreemap } from "@/components/common/stacks";

const Stacks = () => {
  return (
    <main className="section min-h-screen font-Poppins relative flex items-center justify-center overflow-hidden flex-col">
      {/* Section Header */}
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-Poppins font-medium">
          Stacks
        </h2>
      </div>
      <div className="wrapper h-screen w-full">
        <TechStackTreemap
          stacks={[
            { name: "React & Next.Js", percentage: 12 },
            { name: "Tailwind CSS", percentage: 5 },
            { name: "TypeScript", percentage: 7 },
            { name: "JavaScript (ES6+)", percentage: 5 },
            { name: "HTML5", percentage: 4 },
            { name: "CSS3", percentage: 4 },

            { name: "Node.js", percentage: 8 },
            { name: "Express.js", percentage: 5 },
            { name: "Java", percentage: 6 },
            { name: "Spring Boot", percentage: 5 },
            { name: "PostgreSQL", percentage: 4 },
            { name: "MongoDB", percentage: 4 },
            { name: "GraphQL", percentage: 3 },

            { name: "Python", percentage: 5 },
            { name: "TensorFlow", percentage: 3 },
            { name: "PyTorch", percentage: 3 },
            { name: "Scikit-learn", percentage: 2 },
            { name: "Pandas", percentage: 2 },
            { name: "AWS", percentage: 6 },
          ]}
        />
      </div>
    </main>
  );
};

export default Stacks;
