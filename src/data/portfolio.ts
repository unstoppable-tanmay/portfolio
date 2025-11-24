export type TANMAY_TYPE = {
  // Personal Information
  personal: {
    name: string;
    profession: string;
    email: string;
    location: {
      city: string;
      country: string;
      mapLink: string;
    };
  };

  // Social Links
  social: {
    resume: string;
    linkedin: string;
    github: string;
    medium: string;
  };

  // Work Experience
  experience: {
    id: number;
    company: string;
    logo: string;
    role: string;
    duration: string;
    period: string;
    periodShort: string;
    description: string[];
    technologies: string[];
    achievements: string[];
    link: string;
    ai: string[];
  }[];

  // Projects Portfolio
  projects: {
    id: number;
    title: string;
    image: string;
    description: string;
    stacks: string[];
    links: {
      github: string;
    };
    side: string;
    zIndex: number;
  }[];

  // Technical Skills
  skills: {
    id: number;
    name: string;
    percentage: number;
    description: string;
  }[];

  // Blog Configuration
  blog: {
    username: string;
    profileImage: string;
    articlesToShow: number;
  };

  // Resume
  resume: {
    pdfUrl: string;
  };

  // Availability & Metadata
  meta: {
    availability: {
      freelance: boolean;
      fullTime: boolean;
      status: string;
    };
    totalExperience: string;
    totalProjects: string;
    totalTechnologies: string;
    copyright: string;
  };
};

export const TANMAY: TANMAY_TYPE = {
  // Personal Information
  personal: {
    name: "Tanmay Kumar",
    profession: "Software Engineer",
    email: "tanmaypanda752@gmail.com",
    location: {
      city: "Bangalore",
      country: "India",
      mapLink: "https://share.google/REPATkpRwU69G0MQE",
    },
  },

  // Social Links
  social: {
    resume: "/#resume",
    linkedin: "https://linkedin.com/in/tanmay-kumar-panda",
    github: "https://github.com/unstoppable-tanmay",
    medium: "https://medium.com/@tanmaypanda752",
  },

  // Work Experience
  experience: [
    {
      id: 1,
      company: "Papaya Global",
      logo: "/images/companies/papaya.png",
      role: "SDE 1",
      duration: "1 year 4 months",
      period: "Aug 2024 - Present",
      periodShort: "2024-Present",
      description: [
        "Built MCP Agent with Generative AI for Figma-to-UI conversion",
        "Contributed to backend with Java Spring Boot, Kafka, RabbitMQ",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Java Spring Boot",
        "Kafka",
        "RabbitMQ",
        "MariaDB",
        "Playwright",
        "Generative AI",
      ],
      achievements: [
        "Accelerated design-to-production pipeline with AI",
        "Develped Centralized Knoledge Base of Company",
      ],
      ai: ["Worked with microfrontend architecture with react", "Worked with Generative AI with Amazon bedrock", "Worked with RabbitMQ, Redis for caching works", "Deisgned Cache System for high throughput system with InMemory Cache and reloading with RabbitMQ", "Worked with SpringBoot for backend with Kafka, RabbitMQ, MariaDB", "Worked with Playwright for e2e testing", "Designed Fast and Responsive UI with React and microfrontend"],
      link: "https://www.linkedin.com/company/papaya-global",
    },
    {
      id: 2,
      company: "AlphaBI",
      logo: "/images/companies/alphabi.jpeg",
      role: "SDE Intern",
      duration: "7 months",
      period: "Jan 2024 - Aug 2024",
      periodShort: "2023-2024",
      description: [
        "Implemented Next.js 14, Prisma, Strapi, Kafka, Docker",
        "Enhanced company website with SEO optimizations",
        "Worked on a real-time health monitoring app with Flutter",
      ],
      technologies: [
        "Next.js 14",
        "Prisma",
        "Strapi",
        "Kafka",
        "Flutter",
        "Docker",
        "TypeScript",
      ],
      achievements: [
        "Increased UX of the websites",
        "Improved the design of real-time health monitoring app",
      ],
      ai: ["Owned 3 Projects With designing system behind it", "Worked on realtime health app with flutter express from smart band and realtime dashboard", "Worked with modern animated UI for companies", "Worked with GenAI for auto post generation application"],
      link: "https://www.linkedin.com/company/techalphabi",
    },
    {
      id: 3,
      company: "Intelligent Cloud Applications",
      logo: "/images/companies/cloud-application.jpeg",
      role: "SDE Part Time",
      duration: "10 months",
      period: "Mar 2023 - Dec 2023",
      periodShort: "2023",
      description: [
        "Built serverless backend and interactive frontend service",
        "Optimized legacy backend for low API overhead",
        "Led technical team as Tech Lead",
      ],
      technologies: ["Serverless", "React", "Node.js", "AWS", "Next.js", "AWS"],
      achievements: [
        "Reduced server load by 50%",
        "Designed scalable architecture for future growth",
      ],
      ai: ["Redesigned the whole website with modern UI Designed Backend System to handle high load and with payment system high availability", "Designed serverless functions and deloyement pipelines with AWS", "Designed interactive frontend service"],
      link: "https://www.linkedin.com/company/icloudapps/",
    },
  ],

  // Projects Portfolio
  projects: [
    {
      id: 1,
      title: "Ai-Os",
      image: "images/projects/ai-os.svg",
      description:
        "A multimodal AI OS assistant with voice, screen, and keyboard control for app automation. Features a memory-driven 'second brain' for personalized planning, reminders, habit tracking, and emotional support.",
      stacks: ["React", "Electron", "NATS", "Whisper", "llama.cpp", "Chroma"],
      links: {
        github: "https://github.com/unstoppable-tanmay/ai-os",
      },
      side: "left",
      zIndex: -2000 - 1500,
    },
    {
      id: 2,
      title: "Meet",
      image: "images/projects/google-meet.png",
      description:
        "Next-gen video conferencing using Mediasoup's SFU architecture to reduce bandwidth by 50%. Includes screen sharing, chat, recording, scheduling, and Google OAuth2 authentication.",
      stacks: ["Mediasoup", "WebRTC", "Socket.IO", "Next.js", "Express.js"],
      links: {
        github: "https://github.com/unstoppable-tanmay/google-meet-node",
      },
      side: "right",
      zIndex: -2000 - 1500 - 2000,
    },
    {
      id: 3,
      title: "CodeSnip",
      image: "images/projects/codesnip.png",
      description:
        "A social media platform for developers to share and discover code snippets. Built as a modern alternative to Stack Overflow with an intuitive interface for posting, searching, and discussing code blocks across various programming languages.",
      stacks: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
      links: {
        github: "https://github.com/unstoppable-tanmay/CodeSnip",
      },
      side: "left",
      zIndex: -2000 - 1500 - 4000,
    },
  ],

  // Technical Skills
  skills: [
    {
      id: 1,
      name: "React & Next.Js",
      percentage: 12,
      description:
        "Expert in building modern, performant web applications using React and Next.js. Specializing in server-side rendering, static site generation, and creating seamless user experiences with component-based architecture.",
    },
    {
      id: 2,
      name: "Tailwind CSS",
      percentage: 5,
      description:
        "Proficient in utility-first CSS framework for rapid UI development. Creating responsive, maintainable, and highly customizable designs with minimal CSS overhead.",
    },
    {
      id: 3,
      name: "TypeScript",
      percentage: 7,
      description:
        "Strong expertise in TypeScript for type-safe JavaScript development. Building scalable applications with enhanced code quality, better tooling support, and improved developer experience.",
    },
    {
      id: 4,
      name: "JavaScript (ES6+)",
      percentage: 5,
      description:
        "Deep knowledge of modern JavaScript including async/await, destructuring, arrow functions, modules, and functional programming patterns for clean and efficient code.",
    },
    {
      id: 5,
      name: "HTML5",
      percentage: 4,
      description:
        "Solid foundation in semantic HTML5 markup, accessibility standards, and modern web APIs for building well-structured, SEO-friendly web applications.",
    },
    {
      id: 6,
      name: "CSS3",
      percentage: 4,
      description:
        "Advanced CSS3 skills including flexbox, grid, animations, transitions, and responsive design principles for creating beautiful and adaptive user interfaces.",
    },
    {
      id: 7,
      name: "Node.js",
      percentage: 8,
      description:
        "Extensive experience building scalable server-side applications with Node.js. Creating RESTful APIs, real-time applications, and microservices with high performance and reliability.",
    },
    {
      id: 8,
      name: "Express.js",
      percentage: 5,
      description:
        "Skilled in Express.js framework for building robust web servers and APIs. Implementing middleware, routing, authentication, and error handling for production-grade applications.",
    },
    {
      id: 9,
      name: "Java",
      percentage: 6,
      description:
        "Proficient in Java for enterprise application development. Strong understanding of OOP principles, design patterns, and building maintainable, scalable backend systems.",
    },
    {
      id: 10,
      name: "Spring Boot",
      percentage: 5,
      description:
        "Experience with Spring Boot for rapid development of production-ready applications. Building RESTful services, implementing security, and working with Spring ecosystem.",
    },
    {
      id: 11,
      name: "PostgreSQL",
      percentage: 4,
      description:
        "Competent in PostgreSQL for relational database management. Designing schemas, writing complex queries, optimizing performance, and ensuring data integrity.",
    },
    {
      id: 12,
      name: "MongoDB",
      percentage: 4,
      description:
        "Hands-on experience with MongoDB for NoSQL database solutions. Working with document-based data models, aggregation pipelines, and building flexible data architectures.",
    },
    {
      id: 13,
      name: "GraphQL",
      percentage: 3,
      description:
        "Knowledgeable in GraphQL for efficient API development. Creating type-safe schemas, resolvers, and providing clients with precise data fetching capabilities.",
    },
    {
      id: 14,
      name: "Python",
      percentage: 5,
      description:
        "Versatile Python developer for web development, automation, and data processing. Writing clean, pythonic code with strong emphasis on readability and maintainability.",
    },
    {
      id: 15,
      name: "TensorFlow",
      percentage: 3,
      description:
        "Experience with TensorFlow for machine learning and deep learning applications. Building and training neural networks for various AI-powered solutions.",
    },
    {
      id: 16,
      name: "PyTorch",
      percentage: 3,
      description:
        "Familiar with PyTorch framework for research and production machine learning. Implementing custom models and working with dynamic computational graphs.",
    },
    {
      id: 17,
      name: "Scikit-learn",
      percentage: 2,
      description:
        "Proficient in scikit-learn for classical machine learning algorithms. Implementing classification, regression, clustering, and model evaluation techniques.",
    },
    {
      id: 18,
      name: "Pandas",
      percentage: 2,
      description:
        "Skilled in Pandas for data manipulation and analysis. Processing large datasets, cleaning data, and performing complex transformations efficiently.",
    },
    {
      id: 19,
      name: "AWS",
      percentage: 6,
      description:
        "Experienced with AWS cloud services for deploying and managing scalable applications. Working with EC2, S3, Lambda, RDS, and other AWS services for cloud infrastructure.",
    },
  ],

  // Blog Configuration
  blog: {
    username: "tanmaypanda752",
    profileImage: "/images/me.svg",
    articlesToShow: 3,
  },

  // Resume
  resume: {
    pdfUrl: "/tanmay_kumar.pdf",
  },

  // Availability & Metadata
  meta: {
    availability: {
      freelance: true,
      fullTime: true,
      status: "Open to work",
    },
    totalExperience: "3+ Years",
    totalProjects: "15+",
    totalTechnologies: "15+ Technologies",
    copyright:
      "© 2025 Tanmay Kumar • Available for freelance & full-time opportunities",
  },
};
