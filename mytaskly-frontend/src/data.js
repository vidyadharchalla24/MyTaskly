import FeatureImage1 from "./assets/home2.png";
import FeatureImage2 from "./assets/home2.png";
import FeatureImage3 from "./assets/home2.png";
import FeatureImage4 from "./assets/home2.png";
import AboutImage from "./assets/home2.png";
import HomeImage from "./assets/home2.png";

export const images = {
  home: HomeImage,
  about: AboutImage,
  features: [FeatureImage1, FeatureImage2, FeatureImage3, FeatureImage4],
};

export const aboutHighlights = [
  { id: 1, text: "Seamlessly organize and prioritize your tasks." },
  { id: 2, text: "Stay ahead with real-time tracking and deadlines." },
  { id: 3, text: "Integrate with Google Calendar & Outlook." },
];

export const features = [
  {
    id: 1,
    title: "Smart Task & Issue Management",
    description:
      "Easily create, prioritize, and track tasks. Assign priorities like Critical, High, Medium, and Low. Organize work with statuses like To Do, In Progress, Blocked, and Done.",
    quote: "“Managing multiple priorities has never been this seamless. It keeps our workflow structured!”",
    image: FeatureImage1,
    reverse: false,
  },
  {
    id: 2,
    title: "Intuitive Kanban Board & Workflow",
    description:
      "Move tasks effortlessly with drag-and-drop functionality. Customize columns, track progress, and visualize workloads in real time.",
    quote: "“The Kanban board transformed how we track tasks, making it clear and organized!”",
    image: FeatureImage2,
    reverse: true,
  },
  {
    id: 3,
    title: "Seamless Calendar Integration & Reminders",
    description:
      "Sync with Google Calendar & Outlook. Get deadline alerts, set recurring tasks, and track due dates to stay ahead.",
    quote: "“Automated reminders keep me on schedule without missing any deadlines!”",
    image: FeatureImage3,
    reverse: false,
  },
  {
    id: 4,
    title: "Real-time Notifications & Collaboration",
    description:
      "Get instant push notifications and email alerts for task updates. Collaborate effectively with in-task comments and file sharing.",
    quote: "“Notifications ensure I never miss an update, keeping my projects on track!”",
    image: FeatureImage4,
    reverse: true,
  },
];

export const testimonials = [
  {
    name: "Maruti Konduri",
    role: "Software Engineer",
    quote: "This platform has completely transformed the way we work. The team collaboration features are outstanding!",
  },
  {
    name: "Chinmayee Vellanki",
    role: "Project Manager",
    quote: "A fantastic tool for managing projects and staying on top of deadlines. Highly recommended!",
  },
  {
    name: "Abhishek Achugatla",
    role: "Product Designer",
    quote: "The intuitive UI and seamless integrations make this a must-have for any team.",
  },
];

export const pricingPlans = [
    {
      id: 1,
      title: "Basic",
      value: "SUB_FREE",
      price: "Free",
      description: "For individuals",
      features: [
        "Task & Issue Management",
        "Prioritization & Status Tracking",
        "Kanban Board & List View",
        "Due Date Tracking",
      ],
    },
    {
      id: 2,
      title: "Pro",
      value: "SUB_PRO",
      price: "9.99",
      description: "Per User/Month",
      features: [
        "Everything in Basic",
        "Task Dependencies",
        "Google Calendar & Outlook Integration",
        "Email Notifications & Reminders",
      ],
    },
    {
      id: 3,
      title: "Advanced",
      value: "SUB_ADVANCED",
      price: "19.99",
      description: "Per User/Month",
      features: [
        "Everything in Pro",
        "Team Collaboration & Assignments",
        "Advanced Reports & Analytics",
        "Task History & Version Control",
      ],
    },
  ];
  
export const contactInfo = {
  address: "1234 Street, New York, USA",
  email: "contact@email.com",
  phone: "+1 123-456-7890",
  mapUrl: "https://maps.google.com/maps?q=New York&output=embed",
};
