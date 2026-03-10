import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- MOCK DATA FOR SELECTION (Replace with API data later) ---
const ALL_PRODUCTS = [
  { id: 1, name: "Naming Ceremony Honey", price: 2500, image: "/Assets/Products/1.png" },
  { id: 2, name: "Forest Honey", price: 1800, image: "/Assets/Products/15.png" },
  { id: 3, name: "Moringa Atta", price: 80, image: "/Assets/Products/9.png" },
  { id: 4, name: "Saffron Honey", price: 3200, image: "/Assets/Products/1.png" },
  { id: 5, name: "Gulkand", price: 450, image: "/Assets/Products/15.png" },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [showDailyDealsModal, setShowDailyDealsModal] = useState(false);
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([1, 2, 3]); // Default active deals

  const handleOptionClick = (optionId: string) => {
    if (optionId === "banners") {
      onClose();
      router.push("/admin/manageBanners");
    }
    else if (optionId === "add-product") {
      onClose();
      router.push("/admin/addProduct");
    } else if (optionId === "edit-product") {
      onClose();
      router.push("/admin/manageProducts");
    } else if (optionId === "daily-deals") {
      setShowDailyDealsModal(true); // Open the sub-modal
    } else {
      // Handle 'banners' or other future options
      console.log("Selected:", optionId);
    }
  };

  const toggleProductSelection = (id: number) => {
    if (selectedDealIds.includes(id)) {
      setSelectedDealIds(prev => prev.filter(pid => pid !== id));
    } else {
      setSelectedDealIds(prev => [...prev, id]);
    }
  };

  const handleSaveDeals = () => {
    console.log("Saving Daily Deals IDs:", selectedDealIds);
    // TODO: Call your API here to save selectedDealIds to the backend
    setShowDailyDealsModal(false);
  };

  const adminOptions = [
   
    {
      id: "add-product",
      title: "Add New Product",
      description: "Create and add new products to store",
      icon: (
        <svg width="46" height="52" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_8_422)">
            <path d="M14.375 1.4375H23V8.81188C23 9.14356 22.8682 9.46166 22.6337 9.6962C22.3992 9.93074 22.0811 10.0625 21.7494 10.0625H15.6256C15.2939 10.0625 14.9758 9.93074 14.7413 9.6962C14.5068 9.46166 14.375 9.14356 14.375 8.81188V1.4375Z" fill="#FBBF24" />
            <path d="M15.8125 37.375H4.3125C3.16875 37.375 2.07185 36.9206 1.2631 36.1119C0.454351 35.3031 0 34.2062 0 33.0625L0 4.3125C0 3.16875 0.454351 2.07185 1.2631 1.2631C2.07185 0.454351 3.16875 0 4.3125 0L33.0625 0C34.2062 0 35.3031 0.454351 36.1119 1.2631C36.9206 2.07185 37.375 3.16875 37.375 4.3125V15.8125C37.375 16.1937 37.2236 16.5594 36.954 16.829C36.6844 17.0985 36.3187 17.25 35.9375 17.25C35.5563 17.25 35.1906 17.0985 34.921 16.829C34.6514 16.5594 34.5 16.1937 34.5 15.8125V4.3125C34.5 3.93125 34.3486 3.56562 34.079 3.29603C33.8094 3.02645 33.4437 2.875 33.0625 2.875H4.3125C3.93125 2.875 3.56562 3.02645 3.29603 3.29603C3.02645 3.56562 2.875 3.93125 2.875 4.3125V33.0625C2.875 33.4437 3.02645 33.8094 3.29603 34.079C3.56562 34.3486 3.93125 34.5 4.3125 34.5H15.8125C16.1937 34.5 16.5594 34.6514 16.829 34.921C17.0985 35.1906 17.25 35.5563 17.25 35.9375C17.25 36.3187 17.0985 36.6844 16.829 36.954C16.5594 37.2236 16.1937 37.375 15.8125 37.375Z" fill="#373737" />
            <path d="M10.0625 31.625H7.1875C6.80625 31.625 6.44062 31.4736 6.17103 31.204C5.90145 30.9344 5.75 30.5687 5.75 30.1875C5.75 29.8063 5.90145 29.4406 6.17103 29.171C6.44062 28.9014 6.80625 28.75 7.1875 28.75H10.0625C10.4437 28.75 10.8094 28.9014 11.079 29.171C11.3485 29.4406 11.5 29.8063 11.5 30.1875C11.5 30.5687 11.3485 30.9344 11.079 31.204C10.8094 31.4736 10.4437 31.625 10.0625 31.625Z" fill="#373737" />
            <path d="M33.0625 46C30.5037 46 28.0024 45.2412 25.8748 43.8196C23.7473 42.3981 22.089 40.3775 21.1098 38.0135C20.1306 35.6495 19.8744 33.0482 20.3736 30.5385C20.8728 28.0289 22.105 25.7237 23.9143 23.9143C25.7237 22.105 28.0289 20.8728 30.5385 20.3736C33.0482 19.8744 35.6495 20.1306 38.0135 21.1098C40.3775 22.089 42.3981 23.7473 43.8196 25.8748C45.2412 28.0024 46 30.5037 46 33.0625C46 36.4937 44.637 39.7844 42.2107 42.2107C39.7844 44.637 36.4937 46 33.0625 46ZM33.0625 23C31.0723 23 29.1268 23.5902 27.4721 24.6958C25.8173 25.8015 24.5276 27.3731 23.766 29.2118C23.0044 31.0504 22.8051 33.0737 23.1934 35.0256C23.5816 36.9775 24.54 38.7705 25.9472 40.1778C27.3545 41.585 29.1475 42.5434 31.0994 42.9317C33.0513 43.3199 35.0746 43.1207 36.9133 42.359C38.7519 41.5974 40.3235 40.3077 41.4292 38.6529C42.5349 36.9982 43.125 35.0527 43.125 33.0625C43.125 30.3938 42.0649 27.8343 40.1778 25.9472C38.2907 24.0602 35.7312 23 33.0625 23Z" fill="#373737" />
            <path d="M33.0625 40.25C37.032 40.25 40.25 37.032 40.25 33.0625C40.25 29.093 37.032 25.875 33.0625 25.875C29.093 25.875 25.875 29.093 25.875 33.0625C25.875 37.032 29.093 40.25 33.0625 40.25Z" fill="#FBBF24" />
            <path d="M35.9375 31.625H34.5V30.1875C34.5 29.8063 34.3486 29.4406 34.079 29.171C33.8094 28.9014 33.4437 28.75 33.0625 28.75C32.6813 28.75 32.3156 28.9014 32.046 29.171C31.7764 29.4406 31.625 29.8063 31.625 30.1875V31.625H30.1875C29.8063 31.625 29.4406 31.7764 29.171 32.046C28.9014 32.3156 28.75 32.6813 28.75 33.0625C28.75 33.4437 28.9014 33.8094 29.171 34.079C29.4406 34.3486 29.8063 34.5 30.1875 34.5H31.625V35.9375C31.625 36.3187 31.7764 36.6844 32.046 36.954C32.3156 37.2236 32.6813 37.375 33.0625 37.375C33.4437 37.375 33.8094 37.2236 34.079 36.954C34.3486 36.6844 34.5 36.3187 34.5 35.9375V34.5H35.9375C36.3187 34.5 36.6844 34.3486 36.954 34.079C37.2236 33.8094 37.375 33.4437 37.375 33.0625C37.375 32.6813 37.2236 32.3156 36.954 32.046C36.6844 31.7764 36.3187 31.625 35.9375 31.625Z" fill="#373737" />
          </g>
          <defs>
            <clipPath id="clip0_8_422">
              <rect width="46" height="46" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      id: "edit-product",
      title: "Edit Product",
      description: "Update existing product details",
      icon: (
        <svg width="40" height="40" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.0687 23.9536L21.2338 33.1156L40.5027 13.8452L31.3417 4.68259L12.0687 23.9536ZM33.5148 11.6716C34.1512 12.3095 34.1512 13.3427 33.5148 13.9796L22.356 25.1354C22.038 25.4554 21.6205 25.6136 21.2045 25.6136C20.7844 25.6136 20.3679 25.4554 20.0499 25.1354C19.4125 24.4975 19.4125 23.4647 20.0499 22.8278L31.2072 11.6716C31.8436 11.0341 32.8773 11.0341 33.5148 11.6716Z" fill="#FBBF24" />
          <path d="M7.87408 37.1788L18.0563 34.5578L10.5992 27.1008L7.87408 37.1788Z" fill="#FBBF24" />
          <path d="M44.2196 5.3099L39.8759 0.964673C38.5879 -0.322316 36.3415 -0.320799 35.0586 0.964673L33.6472 2.37652L42.8113 11.5381L44.2196 10.1288C45.5455 8.79933 45.5455 6.63733 44.2196 5.3099Z" fill="#FBBF24" />
          <path d="M40.1575 44.2436H1.67723C0.750659 44.2436 0 43.4924 0 42.5659V1.76083C0 0.834255 0.750154 0.0835953 1.67723 0.0835953H27.5146C28.4422 0.0835953 29.1913 0.834255 29.1913 1.76083C29.1913 2.68689 28.4422 3.43806 27.5146 3.43806H3.35446V40.8881H40.1575C41.4677 40.8881 42.5338 39.8225 42.5338 38.5118V17.4696C42.5338 16.543 43.284 15.7923 44.2105 15.7923C45.1366 15.7923 45.8878 16.543 45.8878 17.4696V38.5118C45.8883 41.6721 43.3173 44.2436 40.1575 44.2436Z" fill="#373737" />
        </svg>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            width: "90%",
            maxWidth: "900px",
            padding: "30px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Logo */}
          <div style={{ marginBottom: "20px" }}>
            <Image
              src="/Assets/logo.png"
              alt="FutureNature Logo"
              width={120}
              height={50}
              style={{ objectFit: "contain" }}
            />
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>
            Welcome Back, Admin!
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px" }}>
            Manage your store settings and configurations
          </p>

          {/* Options Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            {adminOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                style={{
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#f9fafb",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  borderLeft: "4px solid #f59e0b",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(245, 158, 11, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "6px" }}>{option.title}</h3>
                  <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.4" }}>{option.description}</p>
                </div>
                <div style={{ fontSize: "32px", flexShrink: 0 }}>{option.icon}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                backgroundColor: "#e5e7eb",
                color: "#1f2937",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d1d5db"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* --- DAILY DEALS MODAL (On Top of Admin Panel) --- */}
      {showDailyDealsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 2100, // Higher than AdminPanel (2000)
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#111827' }}>Select Daily Deals</h3>
              <button
                onClick={() => setShowDailyDealsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}
              >
                ×
              </button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {ALL_PRODUCTS.map(deal => (
                <label
                  key={deal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: selectedDealIds.includes(deal.id) ? '#fffbeb' : '#f9fafb',
                    border: selectedDealIds.includes(deal.id) ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDealIds.includes(deal.id)}
                    onChange={() => toggleProductSelection(deal.id)}
                    style={{ width: '20px', height: '20px', accentColor: '#fbbf24', cursor: 'pointer' }}
                  />
                  <div style={{ width: '50px', height: '50px', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                    <Image src={deal.image}
                      unoptimized alt={deal.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#374151' }}>{deal.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>₹{deal.price}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setShowDailyDealsModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeals}
                style={{
                  flex: 2,
                  backgroundColor: '#fbbf24',
                  color: 'black',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(251, 191, 36, 0.2)'
                }}
              >
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;