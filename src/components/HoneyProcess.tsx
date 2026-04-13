import Image from "next/image";

export default function HoneyProcess() {
  const processes = [
    {
      id: 1,
      title: "Gathering The Nectar Bee Producing Flowers Honey Hive",
      subtitle: "பூக்களை உற்பத்தி செய்யும் தேன் தேனீவை சேகரித்தல் தேன் கூடு",
      description:
        "Bees gather nectar from flowers bright, working gently from morn to night. Within the hive, their sweetness grows, turning flowers pure honey – nature's golden prose",
      descriptionSub:
        "தேனீக்கள் காலை முதல் இரவு வரை மெதுவாக வேலை செய்து பிரகாசமான பூக்களிலிருந்து தேனைச் சேகரிக்கின்றன. கூட்டிற்குள், அவற்றின் இனிப்பு வளர்ந்து, பூக்களை தூய தேனாக மாற்றுகிறது - இயற்கையின் பொன்னான உரைநடை.",
      image: "/Assets/Svg/1.svg",
      position: "left",
    },
    {
      id: 2,
      title: "Converting The Nectar Bee Test Inside The Flowers Beehive",
      subtitle: "பூக்களின் தேன் கூட்டிற்குள் தேன் தேனீ சோதனையை மாற்றுதல்",
      description:
        "Bees test the nectar deep in bloom, Converting sweetness in nature's room. Within the hive they test her magic threads, Turning honey gold—nature's precious bounty spreads",
      descriptionSub:
        "தேனீக்கள் பூக்களின் ஆழத்தில் தேனைச் சோதிக்கின்றன, இயற்கையின் அறையில் இனிமையை மாற்றுகின்றன. கூட்டிற்குள் அவை அதன் மந்திர இழைகளைச் சோதிக்கின்றன, தேனை தங்கமாக மாற்றுகின்றன - இயற்கையின் விலைமதிப்பற்ற கொடை பரவுகிறது",
      image: "/Assets/Svg/2.svg",
      position: "right",
    },
    {
      id: 3,
      title: "Gathering The Nectar Completion Of The Process Of Making Honey.",
      subtitle: "தேன் தயாரிக்கும் செயல்முறையின் தேன் நிறைவைச் சேகரித்தல்.",
      description:
        "Bees gather nectar from blooms so fine, Turning it golden, drop by drop line. When honey flows. The process complete – pure honey gold.",
      descriptionSub:
        "தேனீக்கள் பூக்களிலிருந்து அமிர்தத்தை மிக நுணுக்கமாகச் சேகரிக்கின்றன, அதைத் தங்க நிறமாக மாற்றுகின்றன, சொட்டு சொட்டாக. தேன் பாயும் போது. செயல்முறை முடிந்தது - தூய தேன் தங்கம்.",
      image: "/Assets/Svg/3.svg",
      position: "left",
    },
  ];

  return (
    <div
      style={{
        padding: "80px 20px",
        backgroundColor: "#ffffff",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Section Title */}
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <h2
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#fbbf24",
            margin: "0 0 16px 0",
            letterSpacing: "0.5px",
          }}
        >
          Honey Created In The Laps Of Nature
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#9ca3af",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          (From Beehive To Bottle)
        </p>
      </div>

      {/* Timeline Container */}
      <div
        style={{
          position: "relative",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Vertical Center Line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "0",
            bottom: "0",
            width: "4px",
            backgroundColor: "#FFB400",
            transform: "translateX(-50%)",
            zIndex: 0,
          }}
        ></div>

        {/* Timeline Items */}
        {processes.map((process, index) => (
          <div
            key={process.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              marginBottom: "80px",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {process.position === "left" ? (
              <>
                {/* Left Content */}
                <div style={{ paddingRight: "40px", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#FFB400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        color: "white",
                        fontSize: "18px",
                      }}
                    >
                      {process.id}
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1f2937",
                      margin: "0 0 8px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {process.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      margin: "0 0 12px 0",
                    }}
                  >
                    {process.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: "0",
                      lineHeight: "1.6",
                    }}
                  >
                    {process.description}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      margin: "8px 0 0 0",
                      fontStyle: "italic",
                      lineHeight: "1.5",
                    }}
                  >
                    {process.descriptionSub}
                  </p>
                </div>

                {/* Right Image */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "280px",
                      height: "280px",
                      clipPath:
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      overflow: "hidden",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <Image
                      src={process.image}
                      alt={process.title}
                      width={280}
                      height={280}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      priority={index === 0}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left Image */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "280px",
                      height: "280px",
                      clipPath:
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      overflow: "hidden",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <Image
                      src={process.image}
                      alt={process.title}
                      width={280}
                      height={280}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      priority={index === 0}
                    />
                  </div>
                </div>

                {/* Right Content */}
                <div style={{ paddingLeft: "40px", textAlign: "left" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#FFB400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        color: "white",
                        fontSize: "18px",
                      }}
                    >
                      {process.id}
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1f2937",
                      margin: "0 0 8px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {process.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      margin: "0 0 12px 0",
                    }}
                  >
                    {process.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: "0",
                      lineHeight: "1.6",
                    }}
                  >
                    {process.description}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      margin: "8px 0 0 0",
                      fontStyle: "italic",
                      lineHeight: "1.5",
                    }}
                  >
                    {process.descriptionSub}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
