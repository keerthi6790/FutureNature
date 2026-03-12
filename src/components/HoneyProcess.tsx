import Image from "next/image";
import styles from "../styles/HoneyProcess.module.scss";

export default function HoneyProcess() {
  const processes = [
    {
      id: 1,
      title: "Foraging & Collection",
      subtitle: "Nectar Gathering",
      tamilTitle: "பூக்களை உற்பத்தி செய்யும் தேன்",
      description:
        "Our bees tirelessly visit vibrant wildflowers from dawn until dusk. They gather the finest nectar, nature's sweet essence, beginning the journey from bloom to hive.",
      tamilDesc:
        "தேனீக்கள் காலை முதல் இரவு வரை மெதுவாக வேலை செய்து பிரகாசமான பூக்களிலிருந்து தேனைச் சேகரிக்கின்றன.",
      image: "https://futurenature.s3.ap-south-1.amazonaws.com/others/1.svg",
    },
    {
      id: 2,
      title: "The Hive Alchemy",
      subtitle: "Enzymatic Transformation",
      tamilTitle: "தேன் கூட்டிற்குள் மாற்றம்",
      description:
        "Deep inside the honeycomb, enzymes are added and moisture is reduced. This natural alchemy transforms thin nectar into rich, golden honey.",
      tamilDesc:
        "தேனீக்கள் பூக்களின் ஆழத்தில் தேனைச் சோதிக்கின்றன, இயற்கையின் அறையில் இனிமையை மாற்றுகின்றன.",
      image: "https://futurenature.s3.ap-south-1.amazonaws.com/others/2.svg",
    },
    {
      id: 3,
      title: "Harvesting Gold",
      subtitle: "Pure Extraction",
      tamilTitle: "தேன் நிறைவைச் சேகரித்தல்",
      description:
        "Once the honey reaches perfection, the bees seal the cells with wax. We harvest this liquid gold with care, ensuring every drop retains its medicinal value.",
      tamilDesc:
        "தேனீக்கள் பூக்களிலிருந்து அமிர்தத்தை மிக நுணுக்கமாகச் சேகரிக்கின்றன, அதைத் தங்க நிறமாக மாற்றுகின்றன.",
      image: "https://futurenature.s3.ap-south-1.amazonaws.com/others/3.svg",
    },
  ];

  return (
    <div className={styles.processSection}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>OUR PROCESS</span>
        <h2 className={styles.title}>
          From <span className={styles.highlight}>Hive</span> to Home
        </h2>
        <p className={styles.subTitle}>
          A journey of purity, patience, and passion.
        </p>
      </div>

      <div className={styles.timelineContainer}>
        {/* The Central Line */}
        <div className={styles.timelineTrack}></div>

        {processes.map((item, index) => {
          const isEven = index % 2 !== 0;

          return (
            <div
              key={item.id}
              className={`${styles.timelineRow} ${isEven ? styles.reverse : ""}`}
            >
              {/* --- CONTENT SIDE --- */}
              <div className={styles.contentCol}>
                <div className={styles.processCard}>
                  <span className={styles.stepCount}>Step 0{item.id}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <span className={styles.cardSubtitle}>{item.subtitle}</span>

                  {/* Divider */}
                  <div className={styles.cardDivider}></div>

                  <p className={styles.cardDesc}>{item.description}</p>

                  <div className={styles.tamilBlock}>
                    <p className={styles.tamilTitle}>{item.tamilTitle}</p>
                    <p className={styles.tamilDesc}>{item.tamilDesc}</p>
                  </div>
                </div>
              </div>

              {/* --- CENTER MARKER --- */}
              <div className={styles.markerCol}>
                <div className={styles.honeyMarker}>
                  <div className={styles.markerInner}>{item.id}</div>
                </div>
              </div>

              {/* --- IMAGE SIDE --- */}
              <div className={styles.imageCol}>
                <div className={styles.imgFrame}>
                  <Image
                    unoptimized
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={400}
                    className={styles.processImg}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
