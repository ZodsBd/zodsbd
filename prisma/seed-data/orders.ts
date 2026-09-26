import type { DeliveryZone, OrderStatus } from "@prisma/client";

/** 8 sample orders across statuses. `daysAgo` spreads them over the dashboard chart. */
export const SAMPLE_ORDERS: { name: string; phone: string; district: string; thana: string; address: string; zone: DeliveryZone; status: OrderStatus; daysAgo: number; items: [number, number][]; coupon?: string }[] = [
  { name: "Rahim Ahmed", phone: "01711223344", district: "Dhaka", thana: "Gulshan", address: "House 12, Road 45, Gulshan-2", zone: "INSIDE_DHAKA", status: "PENDING", daysAgo: 0, items: [[0, 1], [7, 1]] },
  { name: "ফারহানা ইসলাম", phone: "01819876543", district: "Chattogram", thana: "Panchlaish", address: "বাড়ি ৭, রোড ৩, পাঁচলাইশ আবাসিক এলাকা", zone: "OUTSIDE_DHAKA", status: "CONFIRMED", daysAgo: 1, items: [[28, 1]], coupon: "WELCOME10" },
  { name: "Tanvir Hasan", phone: "01912345678", district: "Gazipur", thana: "Tongi", address: "Flat 4B, Cherag Ali Market Road", zone: "DHAKA_SUBURBAN", status: "PACKED", daysAgo: 2, items: [[21, 2]] },
  { name: "Sabrina Chowdhury", phone: "01611112222", district: "Dhaka", thana: "Dhanmondi", address: "Road 27 (old), House 55, Dhanmondi", zone: "INSIDE_DHAKA", status: "SHIPPED", daysAgo: 3, items: [[33, 1], [24, 1]] },
  { name: "Mahmud Karim", phone: "01555667788", district: "Sylhet", thana: "Zindabazar", address: "Blue Water Shopping City, Level 3", zone: "OUTSIDE_DHAKA", status: "DELIVERED", daysAgo: 6, items: [[14, 1], [10, 1]] },
  { name: "Rahim Ahmed", phone: "01711223344", district: "Dhaka", thana: "Gulshan", address: "House 12, Road 45, Gulshan-2", zone: "INSIDE_DHAKA", status: "DELIVERED", daysAgo: 12, items: [[6, 1]], coupon: "ZODS500" },
  { name: "Nabila Rahman", phone: "01322334455", district: "Narayanganj", thana: "Fatullah", address: "12 BSCIC Road, Fatullah", zone: "DHAKA_SUBURBAN", status: "CANCELLED", daysAgo: 9, items: [[29, 1]] },
  { name: "Imran Hossain", phone: "01799887766", district: "Rajshahi", thana: "Boalia", address: "Shaheb Bazar, Zero Point", zone: "OUTSIDE_DHAKA", status: "DELIVERED", daysAgo: 20, items: [[15, 1], [22, 1]] },
];
