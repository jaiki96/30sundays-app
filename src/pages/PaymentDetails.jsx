import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { C } from "../data";
import { getTripById } from "../data/tripData";

export default function PaymentDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = getTripById(tripId);

  if (!trip) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: C.sub }}>Trip not found</p>
      </div>
    );
  }

  const dueInstallment = trip.installments.find(i => i.status === "due");
  const progressPct = (trip.amountPaid / trip.totalPackageValue) * 100;

  return (
    <div style={{ background: C.bg, minHeight: "100%" }}>
      {/* Top header with back */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 12px" }}>
        <button
          onClick={() => navigate(`/trips/${trip.id}`)}
          style={{
            width: 34, height: 34, borderRadius: 12, background: C.white, border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <ArrowLeft size={17} color={C.head} />
        </button>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: 0 }}>Payment Details</h4>
      </div>

      {/* Red banner if due */}
      {dueInstallment && (
        <div style={{
          background: C.p600, padding: "14px 16px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0, textAlign: "center" }}>
            Due ₹ {dueInstallment.amount.toLocaleString("en-IN")} of {dueInstallment.label.toLowerCase()}
          </p>
        </div>
      )}

      {/* Total package card */}
      <div style={{ margin: "0 16px 20px", padding: 16, background: "#FFF8F0", borderRadius: 12 }}>
        <p style={{ fontSize: 14, color: C.sub, margin: "0 0 4px" }}>Total package value</p>
        <p style={{ fontSize: 21, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>
          ₹ {trip.totalPackageValue.toLocaleString("en-IN")}
        </p>
        <div style={{ height: 4, background: "#E9EAEB", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: "#039855", borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 12, margin: "8px 0 0" }}>
          <span style={{ color: "#039855", fontWeight: 600 }}>₹ {trip.amountPaid.toLocaleString("en-IN")} Paid</span>
          <span style={{ color: C.sub }}> of ₹ {trip.totalPackageValue.toLocaleString("en-IN")}</span>
        </p>
      </div>

      {/* Installment list */}
      <div style={{ padding: "0 16px" }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>Payment History</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {trip.installments.map(inst => {
            const statusStyles = {
              paid: { color: "#039855", bg: "#ECFDF3", border: "#C0E5D5" },
              due: { color: "#D92D20", bg: "#FEF3F2", border: "#FECDCA" },
              pending: { color: C.sub, bg: C.bg, border: C.div },
            };
            const s = statusStyles[inst.status];

            return (
              <div key={inst.id} style={{
                background: C.white, borderRadius: 12, padding: 16,
                border: `1px solid ${C.div}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: "0 0 4px" }}>{inst.label}</p>
                    <p style={{ fontSize: 13, color: C.sub, margin: "0 0 4px" }}>{inst.date}</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>
                      ₹ {inst.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
                      textTransform: "capitalize",
                    }}>
                      {inst.status}
                    </span>
                    {inst.status === "paid" && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer" }}>Receipt</span>
                    )}
                    {inst.status === "due" && (
                      <button style={{
                        padding: "6px 16px", borderRadius: 8, background: C.p600, color: "#fff",
                        fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit",
                      }}>
                        Pay now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
