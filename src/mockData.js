export const users = [
  { id: 1, name: "Admin", role: "admin" },
  { id: 2, name: "Doctor", role: "doctor" },
  { id: 3, name: "Nurse", role: "nurse" },
  { id: 4, name: "Analyst", role: "analyst" },
];

export const widgets = [
  { 
    id: 1, 
    name: "Patient Stats", 
    type: "status",
    allowedRoles: ["admin", "doctor", "nurse"],
    config: {
      title: "Active Patients",
      value: "1,245",
      icon: "patients",
      progress: 75
    }
  },
  { 
    id: 2, 
    name: "Revenue", 
    type: "status",
    allowedRoles: ["admin"], 
    config: {
      title: "Monthly Revenue",
      value: "₹48,500",
      icon: "revenue",
      progress: 60
    }
  },
  { 
    id: 3, 
    name: "Appointments", 
    type: "chart",
    allowedRoles: ["admin", "doctor"]
  },
  { 
    id: 4, 
    name: "Recent Activities", 
    type: "activity",
    allowedRoles: ["admin", "doctor", "nurse"]
  },
   { 
    id: 5, 
    name: "Lab Results Overview", 
    type: "labPie",
    allowedRoles: ["admin", "doctor", "analyst"] 
  },
  { 
    id: 6, 
    name: "Test Trends", 
    type: "labBar",
    allowedRoles: ["admin", "analyst"] 
  }
];