export type Dil = "tr" | "en" | "ar" | "fa";
export type BilgiSayfasiTuru = "hakkinda" | "iletisim" | "kosullar" | "gizlilik";

export interface BilgiBolumu {
  baslik: string;
  metin?: string;
  maddeler?: string[];
}

export interface BilgiIcerik {
  baslik: string;
  giris: string;
  bolumler: BilgiBolumu[];
}

export const diller: Dil[] = ["tr", "en", "ar", "fa"];
export const sayfalar: BilgiSayfasiTuru[] = ["hakkinda", "iletisim", "kosullar", "gizlilik"];

export const dilAdlari: Record<Dil, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  fa: "فارسی",
};

export const icerik: Record<Dil, Record<BilgiSayfasiTuru, BilgiIcerik>> = {
  tr: {
    hakkinda: {
      baslik: "RandevuCep",
      giris:
        "Berber ve kuaför salonlarında hizmet, berber ve saat seçerek hızlıca randevu almanızı sağlayan bir mobil/masaüstü uygulaması.",
      bolumler: [
        {
          baslik: "Geliştirici",
          metin:
            "Berat Kurşun · 2620511110 · İstinye Üniversitesi MYO063 Mobil Programlama.",
        },
        {
          baslik: "Teknolojiler",
          maddeler: [
            "Tauri v2 ve Rust çekirdeği",
            "Astro statik ön yüz",
            "Svelte 5 runes",
            "React 19 (CanliRozet)",
            "MDX bilgi sayfaları",
          ],
        },
        {
          baslik: "Sayfalar",
          maddeler: [
            "Keşfet ve salon detayı",
            "Randevu sepeti ve doğrudan onay",
            "Randevularım ve RNV kodları",
            "Profil ve gece/gündüz teması",
          ],
        },
        {
          baslik: "Gizlilik",
          metin:
            "Ad, telefon ve randevular yalnızca cihazdaki localStorage içinde tutulur; harici bir sunucuya gönderilmez.",
        },
      ],
    },
    iletisim: {
      baslik: "İletişim",
      giris: "Sorularınız ve geri bildiriminiz için aşağıdaki formu doldurabilirsiniz.",
      bolumler: [],
    },
    kosullar: {
      baslik: "Kullanım Koşulları",
      giris:
        "Bu uygulama İstinye Üniversitesi MYO063 Mobil Programlama dersi kapsamında eğitim amaçlı geliştirilmiştir.",
      bolumler: [
        {
          baslik: "Hizmetin kapsamı",
          metin:
            "RandevuCep, salon kataloğu, randevu taslağı ve RNV kodu üretimi sunar; gerçek ödeme veya canlı takvim servisi içermez.",
        },
        {
          baslik: "Kullanıcı sorumlulukları",
          metin:
            "Kullanıcı, girdiği ad ve telefon bilgisinin doğru olduğundan ve uygulamayı eğitim amacı dışında kötüye kullanmadığından sorumludur.",
        },
        {
          baslik: "Fikri mülkiyet",
          metin:
            "Proje kodu ve tasarımı eğitim amacıyla paylaşılır; üçüncü taraf marka ve görselleri kendi lisanslarına tabidir.",
        },
        {
          baslik: "Eğitim projesi",
          metin:
            "Uygulama ticari bir hizmet değildir; kesinti, veri kaybı veya randevu iptali konusunda garanti vermez.",
        },
      ],
    },
    gizlilik: {
      baslik: "Gizlilik Politikası",
      giris: "RandevuCep, kişisel verileri harici sunucularda saklamaz.",
      bolumler: [
        {
          baslik: "Toplanan veriler",
          metin:
            "Ad, telefon ve oluşturduğunuz randevular uygulama içinde tutulur; e-posta veya ödeme bilgisi toplanmaz.",
        },
        {
          baslik: "Yerel depolama",
          metin:
            "Veriler localStorage içinde saklanır. Tarayıcı verilerini temizlediğinizde randevular ve profil bilgisi silinir.",
        },
        {
          baslik: "KVKK ve veri koruma",
          metin:
            "Uygulama eğitim amaçlıdır; verileriniz üçüncü taraflarla paylaşılmaz veya reklam amacıyla işlenmez.",
        },
        {
          baslik: "Çerezler ve izleme",
          metin:
            "Harici izleme çerezi kullanılmaz. Tauri WebView yalnızca uygulamanın yerel varlıklarını yükler.",
        },
      ],
    },
  },
  en: {
    hakkinda: {
      baslik: "RandevuCep",
      giris:
        "A mobile and desktop app that lets you book a barber or hairdresser by choosing a service, a barber and a time.",
      bolumler: [
        {
          baslik: "Developer",
          metin:
            "Berat Kurşun · 2620511110 · İstinye University, MYO063 Mobile Programming.",
        },
        {
          baslik: "Technologies",
          maddeler: [
            "Tauri v2 and Rust core",
            "Astro static frontend",
            "Svelte 5 runes",
            "React 19 (CanliRozet)",
            "MDX information pages",
          ],
        },
        {
          baslik: "Screens",
          maddeler: [
            "Discover and salon detail",
            "Appointment cart and direct confirmation",
            "My appointments and RNV codes",
            "Profile and light/dark theme",
          ],
        },
        {
          baslik: "Privacy",
          metin:
            "Name, phone and appointments stay in the device's localStorage; they are not sent to an external server.",
        },
      ],
    },
    iletisim: {
      baslik: "Contact",
      giris: "Use the form below for your questions and feedback.",
      bolumler: [],
    },
    kosullar: {
      baslik: "Terms of Use",
      giris:
        "This app was developed for educational purposes within İstinye University MYO063 Mobile Programming.",
      bolumler: [
        {
          baslik: "Scope of service",
          metin:
            "RandevuCep provides a salon catalog, appointment drafts and RNV code generation; it does not include real payments or a live calendar service.",
        },
        {
          baslik: "User responsibilities",
          metin:
            "You are responsible for the accuracy of your name and phone number and for using the app only for its educational purpose.",
        },
        {
          baslik: "Intellectual property",
          metin:
            "The project code and design are shared for educational use; third-party brands and images remain under their own licenses.",
        },
        {
          baslik: "Educational project",
          metin:
            "This is not a commercial service and provides no guarantee against downtime, data loss or appointment cancellation.",
        },
      ],
    },
    gizlilik: {
      baslik: "Privacy Policy",
      giris: "RandevuCep does not store personal data on external servers.",
      bolumler: [
        {
          baslik: "Data collected",
          metin:
            "Your name, phone and appointments are kept inside the app; no email or payment data is collected.",
        },
        {
          baslik: "Local storage",
          metin:
            "Data is stored in localStorage. Clearing your browser data removes your appointments and profile information.",
        },
        {
          baslik: "Data protection",
          metin:
            "The app is educational; your data is not shared with third parties or processed for advertising.",
        },
        {
          baslik: "Cookies and tracking",
          metin:
            "No external tracking cookies are used. The Tauri WebView only loads the app's local assets.",
        },
      ],
    },
  },
  ar: {
    hakkinda: {
      baslik: "RandevuCep",
      giris:
        "تطبيق للجوال والحاسوب يتيح حجز موعد في صالونات الحلاقة والتجميل عبر اختيار الخدمة والحلاق والوقت.",
      bolumler: [
        {
          baslik: "المطوّر",
          metin:
            "برات كوروشون · 2620511110 · جامعة إستينيه، مقرر MYO063 لبرمجة الجوال.",
        },
        {
          baslik: "التقنيات",
          maddeler: [
            "Tauri v2 ونواة Rust",
            "واجهة Astro الثابتة",
            "Svelte 5 runes",
            "React 19 (CanliRozet)",
            "صفحات MDX المعلوماتية",
          ],
        },
        {
          baslik: "الصفحات",
          maddeler: [
            "استكشاف الصالونات وتفاصيلها",
            "سلة المواعيد والتأكيد المباشر",
            "مواعيدي وأكواد RNV",
            "الملف الشخصي والمظهر الليلي/النهاري",
          ],
        },
        {
          baslik: "الخصوصية",
          metin:
            "يبقى الاسم والهاتف والمواعيد في localStorage على الجهاز فقط، ولا تُرسل إلى خادم خارجي.",
        },
      ],
    },
    iletisim: {
      baslik: "اتصل بنا",
      giris: "يمكنك ملء النموذج أدناه للأسئلة والملاحظات.",
      bolumler: [],
    },
    kosullar: {
      baslik: "شروط الاستخدام",
      giris:
        "تم تطوير هذا التطبيق لأغراض تعليمية ضمن مقرر MYO063 لبرمجة الجوال في جامعة إستينيه.",
      bolumler: [
        {
          baslik: "نطاق الخدمة",
          metin:
            "يوفر RandevuCep كتالوج الصالونات ومسودات المواعيد وتوليد أكواد RNV؛ ولا يتضمن مدفوعات حقيقية أو خدمة تقويم مباشرة.",
        },
        {
          baslik: "مسؤوليات المستخدم",
          metin:
            "أنت مسؤول عن صحة الاسم ورقم الهاتف وعن استخدام التطبيق لغرضه التعليمي فقط.",
        },
        {
          baslik: "الملكية الفكرية",
          metin:
            "تُشارك أكواد المشروع وتصميمه لأغراض تعليمية؛ وتبقى العلامات والصور الخارجية تحت تراخيصها الخاصة.",
        },
        {
          baslik: "مشروع تعليمي",
          metin:
            "هذه ليست خدمة تجارية ولا تقدم ضمانًا ضد الانقطاع أو فقدان البيانات أو إلغاء الموعد.",
        },
      ],
    },
    gizlilik: {
      baslik: "سياسة الخصوصية",
      giris: "لا يحفظ RandevuCep البيانات الشخصية على خوادم خارجية.",
      bolumler: [
        {
          baslik: "البيانات المجمعة",
          metin:
            "يُحفظ الاسم والهاتف والمواعيد داخل التطبيق؛ ولا يتم جمع البريد الإلكتروني أو بيانات الدفع.",
        },
        {
          baslik: "التخزين المحلي",
          metin:
            "تُخزَّن البيانات في localStorage. عند مسح بيانات المتصفح تُحذف المواعيد ومعلومات الملف الشخصي.",
        },
        {
          baslik: "حماية البيانات",
          metin:
            "التطبيق تعليمي؛ ولا تُشارك بياناتك مع أطراف ثالثة أو تُستخدم للإعلانات.",
        },
        {
          baslik: "ملفات تعريف الارتباط والتتبع",
          metin:
            "لا تُستخدم ملفات تتبع خارجية. ويحمّل Tauri WebView موارد التطبيق المحلية فقط.",
        },
      ],
    },
  },
  fa: {
    hakkinda: {
      baslik: "RandevuCep",
      giris:
        "برنامه‌ای برای موبایل و دسکتاپ که با انتخاب خدمت، آرایشگر و زمان، نوبت آرایشگاه یا سالن زیبایی می‌گیرد.",
      bolumler: [
        {
          baslik: "توسعه‌دهنده",
          metin:
            "برات کوروشون · 2620511110 · دانشگاه استانبول، درس MYO063 برنامه‌نویسی موبایل.",
        },
        {
          baslik: "فناوری‌ها",
          maddeler: [
            "Tauri v2 و هسته Rust",
            "رابط ثابت Astro",
            "Svelte 5 runes",
            "React 19 (CanliRozet)",
            "صفحه‌های اطلاعاتی MDX",
          ],
        },
        {
          baslik: "صفحه‌ها",
          maddeler: [
            "کشف و جزئیات سالن",
            "سبد نوبت و تأیید مستقیم",
            "نوبت‌های من و کدهای RNV",
            "پروفایل و پوسته شب/روز",
          ],
        },
        {
          baslik: "حریم خصوصی",
          metin:
            "نام، تلفن و نوبت‌ها فقط در localStorage دستگاه می‌مانند و به سرور خارجی ارسال نمی‌شوند.",
        },
      ],
    },
    iletisim: {
      baslik: "تماس با ما",
      giris: "برای پرسش‌ها و بازخورد، فرم زیر را پر کنید.",
      bolumler: [],
    },
    kosullar: {
      baslik: "شرایط استفاده",
      giris:
        "این برنامه برای اهداف آموزشی در درس MYO063 برنامه‌نویسی موبایل دانشگاه استانبول توسعه یافته است.",
      bolumler: [
        {
          baslik: "دامنه خدمت",
          metin:
            "RandevuCep کاتالوگ سالن، پیش‌نویس نوبت و تولید کد RNV ارائه می‌دهد؛ پرداخت واقعی یا تقویم زنده ندارد.",
        },
        {
          baslik: "مسئولیت‌های کاربر",
          metin:
            "کاربر مسئول صحت نام و شماره تلفن و استفاده از برنامه فقط برای هدف آموزشی است.",
        },
        {
          baslik: "مالکیت فکری",
          metin:
            "کد و طراحی پروژه برای استفاده آموزشی به اشتراک گذاشته می‌شود؛ برندها و تصاویر شخص ثالث تابع مجوز خود هستند.",
        },
        {
          baslik: "پروژه آموزشی",
          metin:
            "این یک سرویس تجاری نیست و در برابر قطعی، از دست رفتن داده یا لغو نوبت تضمینی ارائه نمی‌دهد.",
        },
      ],
    },
    gizlilik: {
      baslik: "سیاست حریم خصوصی",
      giris: "RandevuCep داده‌های شخصی را در سرورهای خارجی ذخیره نمی‌کند.",
      bolumler: [
        {
          baslik: "داده‌های جمع‌آوری‌شده",
          metin:
            "نام، تلفن و نوبت‌ها داخل برنامه نگه داشته می‌شوند؛ ایمیل یا داده پرداخت جمع‌آوری نمی‌شود.",
        },
        {
          baslik: "ذخیره‌سازی محلی",
          metin:
            "داده‌ها در localStorage ذخیره می‌شوند. با پاک کردن داده‌های مرورگر، نوبت‌ها و اطلاعات پروفایل حذف می‌شوند.",
        },
        {
          baslik: "حفاظت از داده‌ها",
          metin:
            "برنامه آموزشی است؛ داده‌های شما با اشخاص ثالث به اشتراک گذاشته یا برای تبلیغات پردازش نمی‌شود.",
        },
        {
          baslik: "کوکی‌ها و ردیابی",
          metin:
            "از کوکی ردیابی خارجی استفاده نمی‌شود. Tauri WebView فقط منابع محلی برنامه را بارگذاری می‌کند.",
        },
      ],
    },
  },
};

export const formMetinleri: Record<
  Dil,
  { ad: string; eposta: string; konu: string; mesaj: string; gonder: string; basarili: string }
> = {
  tr: {
    ad: "Ad Soyad",
    eposta: "E-posta",
    konu: "Konu",
    mesaj: "Mesaj",
    gonder: "Gönder",
    basarili: "Mesajınız iletildi. Form temizlendi.",
  },
  en: {
    ad: "Full name",
    eposta: "Email",
    konu: "Subject",
    mesaj: "Message",
    gonder: "Send",
    basarili: "Your message has been sent. The form has been cleared.",
  },
  ar: {
    ad: "الاسم الكامل",
    eposta: "البريد الإلكتروني",
    konu: "الموضوع",
    mesaj: "الرسالة",
    gonder: "إرسال",
    basarili: "تم إرسال رسالتك. تم تفريغ النموذج.",
  },
  fa: {
    ad: "نام و نام خانوادگی",
    eposta: "ایمیل",
    konu: "موضوع",
    mesaj: "پیام",
    gonder: "ارسال",
    basarili: "پیام شما ارسال شد. فرم پاک شد.",
  },
};
