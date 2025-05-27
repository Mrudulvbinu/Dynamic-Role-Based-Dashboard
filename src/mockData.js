export const users = [
  { id: 1, name: "Admin", role: "admin" },
  { id: 2, name: "Doctor", role: "doctor" },
  { id: 3, name: "Nurse", role: "nurse" },
  { id: 4, name: "Analyst", role: "analyst" },
  { id: 5, name: "Patient", role: "patient" },

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
  },
  {
  id: 7,
  name: "Health Summary",
  type: "patientStatus",
  allowedRoles: ["patient"],
  config: {
    title: "Health Status",
    value: "Good",
    icon: "health",
    progress: 80,
    color: "success",
    unit: "%",
    description: "Overall wellness score"
  }
},
{
  id: 8,
  name: "Upcoming Appointments",
  type: "appointmentList",
  allowedRoles: ["patient"],
  config: {
    appointments: [
      { date: "2025-05-30", time: "10:00 AM", doctor: " Dr. John" },
      { date: "2025-05-28", time: "1:30 PM", doctor: " Dr. Smith" }
    ]
  }
},
{
  id: 9,
  name: "Prescriptions",
  type: "prescriptionList",
  allowedRoles: ["patient"],
  config: {
    prescriptions: [
      { name: "Paracetamol", dosage: "500mg", schedule: "Twice a day" },
      { name: "Vitamin D", dosage: "2000 IU", schedule: "Once a day" }
    ]
  }
}

];