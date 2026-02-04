// Định nghĩa các type và interface dùng chung.

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}
