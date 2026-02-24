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
      id: "banners",
      title: "Banners",
      description: "Manage and create promotional banners",
      icon: (
        <svg width="32" height="42" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_8_433" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="38" height="38">
            <path d="M37.3319 0H0V37.3312H37.3319V0Z" fill="white" />
          </mask>
          <g mask="url(#mask0_8_433)">
            <path d="M14.048 1.4375H3.59375C2.40289 1.4375 1.4375 2.40289 1.4375 3.59375V16.4817C1.4375 17.6726 2.40289 18.6379 3.59375 18.6379H14.048C15.2389 18.6379 16.2042 17.6726 16.2042 16.4817V3.59375C16.2042 2.40289 15.2389 1.4375 14.048 1.4375Z" stroke="#373737" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M33.7382 1.4375H23.2839C22.0931 1.4375 21.1277 2.40289 21.1277 3.59375V6.66425C21.1277 7.85515 22.0931 8.8205 23.2839 8.8205H33.7382C34.929 8.8205 35.8944 7.85515 35.8944 6.66425V3.59375C35.8944 2.40289 34.929 1.4375 33.7382 1.4375Z" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M33.7382 13.7432H23.2839C22.0931 13.7432 21.1277 14.7086 21.1277 15.8995V33.7381C21.1277 34.929 22.0931 35.8944 23.2839 35.8944H33.7382C34.929 35.8944 35.8944 34.929 35.8944 33.7381V15.8995C35.8944 14.7086 34.929 13.7432 33.7382 13.7432Z" stroke="#373737" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.048 23.588H3.59375C2.40289 23.588 1.4375 24.5533 1.4375 25.7442V33.7374C1.4375 34.9282 2.40289 35.8937 3.59375 35.8937H14.048C15.2389 35.8937 16.2042 34.9282 16.2042 33.7374V25.7442C16.2042 24.5533 15.2389 23.588 14.048 23.588Z" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    },
    {
      id: "daily-deals",
      title: "Daily Deals",
      description: "Setup daily deals and special offers",
      icon: (
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_8_332)">
            <path d="M23.0002 37.0968C30.7856 37.0968 37.097 30.7854 37.097 23C37.097 15.2145 30.7856 8.90319 23.0002 8.90319C15.2147 8.90319 8.90338 15.2145 8.90338 23C8.90338 30.7854 15.2147 37.0968 23.0002 37.0968Z" fill="#FBBF24" />
            <path d="M23.0002 0C16.9704 0 11.1842 2.38526 6.89941 6.58314L5.92298 1.34727L4.46428 1.6203L5.80649 8.81108L13.2733 9.64062L13.4373 8.16641L8.02113 7.56463C12.0202 3.68648 17.3977 1.48371 23 1.48371C34.8635 1.48371 44.516 11.1356 44.516 22.9998C44.516 29.4747 41.6374 35.2862 37.0967 39.234V37.8385C36.4639 37.8385 35.8955 37.4868 35.6128 36.9214L35.3078 36.3116C36.3265 36.1076 37.0967 35.2068 37.0967 34.1288C37.0967 32.9016 36.0981 31.9029 34.8709 31.9029H31.9032V39.3222H33.3871V35.7877L34.2856 37.5846C34.8065 38.6278 35.8421 39.2814 37.0027 39.3156C33.2359 42.5527 28.3443 44.5158 23.0002 44.5158C11.1367 44.5158 1.48421 34.864 1.48421 22.9997C1.48421 20.808 1.81738 18.6364 2.47535 16.5449L1.0597 16.0997C0.356311 18.3354 0.000183105 20.6568 0.000183105 23C0.000183105 35.6818 10.3174 46 23 46C35.6826 46 45.9999 35.6819 45.9999 23C45.9999 10.3181 35.6826 0 23.0002 0ZM33.3871 34.8709V33.3871H34.8709C35.2804 33.3871 35.6128 33.7202 35.6128 34.1291C35.6128 34.5379 35.2804 34.8711 34.8709 34.8711L33.3871 34.8709Z" fill="#373737" />
            <path d="M3.97333 12.9594L2.66167 12.2657C2.37234 12.8117 2.1289 13.314 1.91681 13.7984L3.27595 14.3934C3.47475 13.9425 3.70172 13.4735 3.97333 12.9594Z" fill="#373737" />
            <path d="M17.4223 25.0358L8.41827 30.4385C7.34466 31.0825 6.67767 32.26 6.67767 33.5123C6.67767 35.4889 8.28547 37.0965 10.2619 37.0965H23.0002V35.6128H10.2619C9.10377 35.6128 8.16154 34.6705 8.16154 33.5124C8.16154 32.7786 8.55186 32.0887 9.18165 31.7117L18.1865 26.3082C21.1556 24.5268 23 21.2691 23 17.8064C23 13.3065 19.3386 9.64505 14.8389 9.64505C10.3391 9.64505 6.67767 13.3065 6.67767 17.8064V19.2903H8.16154V17.8064C8.16154 14.125 11.1567 11.1289 14.8389 11.1289C18.5211 11.1289 21.5162 14.1248 21.5162 17.8064C21.5163 20.7512 19.9478 23.5215 17.4223 25.0358Z" fill="#373737" />
            <path d="M33.2937 10.0058L31.9968 9.28465L24.7994 22.2395C24.5931 22.6119 24.4841 23.0334 24.4841 23.4577C24.4841 24.8414 25.6104 25.9677 26.9941 25.9677H34.1293V30.4193H35.613V25.9677H42.2903V24.4839H35.613V9.6452H34.1291V24.4839H26.9939C26.4277 24.4839 25.9678 24.0239 25.9678 23.4577C25.9678 23.2841 26.013 23.1121 26.0969 22.96L33.2937 10.0058Z" fill="#373737" />
            <path d="M24.4839 39.3225H25.9678V36.3548H28.9355V39.3225H30.4194V31.9032H28.9355V34.8709H25.9678V31.9032H24.4839V39.3225Z" fill="#373737" />
          </g>
          <defs>
            <clipPath id="clip0_8_332">
              <rect width="46" height="46" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    },
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