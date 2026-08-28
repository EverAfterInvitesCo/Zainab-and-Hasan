import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  nav: {
    invitation: string;
    date: string;
    venue: string;
    memories: string;
    guestbook: string;
    rsvp: string;
  };
  entry: {
    bride: string;
    and: string;
    groom: string;
    dateFormatted: string;
    enterButton: string;
  };
  hero: {
    bride: string;
    and: string;
    groom: string;
    date: string;
    location: string;
    scrollHint: string;
  };
  invitation: {
    heading: string;
    subtitle: string;
    body: string;
    names: string;
  };
  countdown: {
    day: string;
    month: string;
    year: string;
    monthName: string;
    time: string;
    subheading: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  venue: {
    heading: string;
    name: string;
    hall: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    viewLocation: string;
  };
  memories: {
    heading: string;
    scrollInstruction: string;
  };
  guestbook: {
    heading: string;
    subtitle: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    photoLabel: string;
    photoDropText: string;
    photoChangeText: string;
    submitButton: string;
    submittingButton: string;
    successNotice: string;
    emptyMessage: string;
    approvedTag: string;
  };
  rsvp: {
    heading: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    question: string;
    yesOption: string;
    noOption: string;
    guestCountLabel: string;
    contactLabel: string;
    contactPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    adultsOnlyNoticeTitle: string;
    adultsOnlyNoticeText: string;
    submitButton: string;
    submittingButton: string;
    thankYouTitle: string;
    thankYouSubtitle: string;
    alreadySubmitted: string;
    changeResponse: string;
  };
  final: {
    brideAndGroom: string;
    dateFormatted: string;
    seeYouThere: string;
  };
  admin: {
    title: string;
    portalName: string;
    pinPlaceholder: string;
    loginButton: string;
    logoutButton: string;
    overview: string;
    confirmed: string;
    declined: string;
    pending: string;
    totalGuests: string;
    totalResponses: string;
    exportCsv: string;
    guestTable: string;
    guestbookMgmt: string;
    searchPlaceholder: string;
    allFilter: string;
    approve: string;
    hide: string;
    delete: string;
    backToSite: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      invitation: 'INVITATION',
      date: 'DATE',
      venue: 'VENUE',
      memories: 'MEMORIES',
      guestbook: 'GUESTBOOK',
      rsvp: 'RSVP',
    },
    entry: {
      bride: 'ZAINAB',
      and: '&',
      groom: 'HASAN',
      dateFormatted: '08 · 01 · 27',
      enterButton: 'ENTER',
    },
    hero: {
      bride: 'ZAINAB',
      and: '&',
      groom: 'HASAN',
      date: '8 JANUARY 2027',
      location: 'DUBAI',
      scrollHint: 'SCROLL TO EXPLORE',
    },
    invitation: {
      heading: '',
      subtitle: 'And so, our forever begins',
      body: 'With great joy, we invite you to celebrate the wedding of',
      names: 'Zainab Marwan Alhamdani & Hasan Hassan Elhaj',
    },
    countdown: {
      day: '08',
      month: '01',
      year: '27',
      monthName: 'JANUARY 2027',
      time: '6:00 PM',
      subheading: 'UNTIL WE CELEBRATE THIS MEMORABLE NIGHT',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
    },
    venue: {
      heading: 'THE VENUE',
      name: 'Mövenpick Hotel & Apartments Bur Dubai',
      hall: 'Oud Metha Ballroom',
      addressLine1: '19th Street, Oud Metha',
      addressLine2: 'Bur Dubai',
      city: 'Dubai, United Arab Emirates',
      viewLocation: 'VIEW LOCATION',
    },
    memories: {
      heading: 'MEMORIES',
      scrollInstruction: 'Swipe or scroll horizontally',
    },
    guestbook: {
      heading: 'THE GUESTBOOK',
      subtitle: 'A digital collection of heartfelt notes and warm wishes.',
      formTitle: 'LEAVE A NOTE',
      nameLabel: 'Your name',
      namePlaceholder: 'Enter your full name',
      messageLabel: 'Your message',
      messagePlaceholder: 'Write your blessings and words for the bride & groom...',
      photoLabel: 'Upload a photo (optional)',
      photoDropText: 'Drag & drop a photograph or click to browse',
      photoChangeText: 'Change photo',
      submitButton: 'SUBMIT NOTE',
      submittingButton: 'SUBMITTING...',
      successNotice: 'Thank you for your note. It has been received and will appear shortly after review.',
      emptyMessage: 'No published notes yet. Be the first to leave a message.',
      approvedTag: 'GUESTBOOK ARCHIVE',
    },
    rsvp: {
      heading: 'KINDLY RSVP',
      subtitle: 'We look forward to celebrating with you.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Please enter your name',
      question: 'Will you be joining us?',
      yesOption: 'YES, WITH PLEASURE',
      noOption: 'REGRETTABLY, NO',
      guestCountLabel: 'Number of Guests attending',
      contactLabel: 'Email or Mobile (Optional)',
      contactPlaceholder: 'For confirmation updates',
      notesLabel: 'Dietary requirements or special note (Optional)',
      notesPlaceholder: 'Any note for the couple...',
      adultsOnlyNoticeTitle: 'IMPORTANT',
      adultsOnlyNoticeText: 'This is an adults-only celebration. Kindly note that children are not permitted.',
      submitButton: 'CONFIRM RSVP',
      submittingButton: 'CONFIRMING...',
      thankYouTitle: 'THANK YOU',
      thankYouSubtitle: 'We look forward to seeing you.',
      alreadySubmitted: 'Your RSVP has already been recorded. Thank you!',
      changeResponse: 'Update Response',
    },
    final: {
      brideAndGroom: 'ZAINAB & HASAN',
      dateFormatted: '08 · 01 · 27',
      seeYouThere: 'SEE YOU THERE',
    },
    admin: {
      title: 'ORGANIZER PORTAL',
      portalName: 'Z&H PRIVATE PORTAL',
      pinPlaceholder: 'Enter Security PIN (ZH2027)',
      loginButton: 'ACCESS PORTAL',
      logoutButton: 'LOGOUT',
      overview: 'RSVP OVERVIEW',
      confirmed: 'CONFIRMED',
      declined: 'DECLINED',
      pending: 'PENDING',
      totalGuests: 'TOTAL GUESTS',
      totalResponses: 'TOTAL RESPONSES',
      exportCsv: 'EXPORT CSV',
      guestTable: 'GUEST LIST',
      guestbookMgmt: 'GUESTBOOK MODERATION',
      searchPlaceholder: 'Search by guest name...',
      allFilter: 'ALL',
      approve: 'APPROVE',
      hide: 'HIDE',
      delete: 'DELETE',
      backToSite: 'RETURN TO INVITATION',
    },
  },
  ar: {
    nav: {
      invitation: 'الدعوة',
      date: 'التاريخ',
      venue: 'الموقع',
      memories: 'الذكريات',
      guestbook: 'دفتر الذكريات',
      rsvp: 'تأكيد الحضور',
    },
    entry: {
      bride: 'زينب',
      and: 'و',
      groom: 'حسن',
      dateFormatted: '٠٨ · ٠١ · ٢٧',
      enterButton: 'دخول',
    },
    hero: {
      bride: 'زينب',
      and: 'و',
      groom: 'حسن',
      date: '٨ يناير ٢٠٢٧',
      location: 'دبي',
      scrollHint: 'مرر للأسفل للاستكشاف',
    },
    invitation: {
      heading: '',
      subtitle: 'وهكذا تبدأ حكايتنا الأبدية',
      body: 'ببالغ الفرح والسرور، نتشرف بدعوتكم للاحتفال بزفاف',
      names: 'زينب مروان الحمدني و حسن بسام الحاج',
    },
    countdown: {
      day: '٨',
      month: '١',
      year: '٢٧',
      monthName: 'يناير ٢٠٢٧',
      time: '٦:٠٠ مساءً',
      subheading: 'حتى نلتقي في هذه الليلة المميزة',
      days: 'أيام',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثوانٍ',
    },
    venue: {
      heading: 'الموقع',
      name: 'فندق موڤنمبيك دبي',
      hall: 'قاعة عود ميثاء',
      addressLine1: 'شارع ١٩، عود ميثاء',
      addressLine2: 'بر دبي',
      city: 'دبي، الإمارات العربية المتحدة',
      viewLocation: 'عرض الموقع',
    },
    memories: {
      heading: 'الذكريات',
      scrollInstruction: 'اسحب أفقياً لاستعراض الصور',
    },
    guestbook: {
      heading: 'دفتر الذكريات',
      subtitle: 'مساحة رقمية لمشاركة التهاني وأجمل الذكريات مع العروسين.',
      formTitle: 'اتركوا لنا ذكرى',
      nameLabel: 'الاسم',
      namePlaceholder: 'الاسم الكريم',
      messageLabel: 'رسالتكم',
      messagePlaceholder: 'اكتبوا تهنئتكم أو كلمتكم للعروسين...',
      photoLabel: 'إضافة صورة (اختياري)',
      photoDropText: 'اسحب وأفلت صورة أو اضغط للتصفح',
      photoChangeText: 'تغيير الصورة',
      submitButton: 'إرسال',
      submittingButton: 'جاري الإرسال...',
      successNotice: 'شكرًا لرسالتكم الجميلة. ستظهر في دفتر الذكريات بعد المراجعة.',
      emptyMessage: 'لا توجد مشاركات منشورة بعد. كونوا أول من يترك ذكرى.',
      approvedTag: 'أرشيف الذكريات',
    },
    rsvp: {
      heading: 'تأكيد الحضور',
      subtitle: 'نتشرّف بتأكيد حضوركم ومشاركتنا فرحتنا.',
      nameLabel: 'الاسم',
      namePlaceholder: 'يرجى كتابة الاسم الكامل',
      question: 'هل ستشاركوننا الاحتفال؟',
      yesOption: 'نعم، بكل سرور',
      noOption: 'نعتذر عن الحضور',
      guestCountLabel: 'عدد الحاضرين',
      contactLabel: 'البريد أو رقم الهاتف (اختياري)',
      contactPlaceholder: 'لتصلكم تفاصيل الحفل',
      notesLabel: 'ملاحظات خاصة أو أمنيات (اختياري)',
      notesPlaceholder: 'أي ملاحظة تودون إضافتها...',
      adultsOnlyNoticeTitle: 'تنويه',
      adultsOnlyNoticeText: 'الحفل مخصّص للكبار فقط، ونعتذر عن عدم السماح باصطحاب الأطفال.',
      submitButton: 'تأكيد الحضور',
      submittingButton: 'جاري التأكيد...',
      thankYouTitle: 'شكرًا لكم',
      thankYouSubtitle: 'نتطلّع لرؤيتكم ومشاركتكم هذه الليلة المميزة.',
      alreadySubmitted: 'تم استلام تأكيد حضوركم مسبقًا. شكرًا لكم!',
      changeResponse: 'تعديل الرد',
    },
    final: {
      brideAndGroom: 'زينب وحسن',
      dateFormatted: '٨ · ١ · ٢٧',
      seeYouThere: 'بانتظاركم',
    },
    admin: {
      title: 'بوابة المنظمين',
      portalName: 'بوابة زينب وحسن الخاصة',
      pinPlaceholder: 'رمز الدخول السري (ZH2027)',
      loginButton: 'تسجيل الدخول',
      logoutButton: 'خروج',
      overview: 'ملخص الحضور',
      confirmed: 'تأكيد الحضور',
      declined: 'اعتذار',
      pending: 'قيد الانتظار',
      totalGuests: 'إجمالي الضيوف',
      totalResponses: 'إجمالي الردود',
      exportCsv: 'تصدير ملف CSV',
      guestTable: 'قائمة المدعوين',
      guestbookMgmt: 'إدارة دفتر الذكريات',
      searchPlaceholder: 'البحث باسم الضيف...',
      allFilter: 'الكل',
      approve: 'اعتماد',
      hide: 'إخفاء',
      delete: 'حذف',
      backToSite: 'العودة للدعوة',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('zh_wedding_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('zh_wedding_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRtl = language === 'ar';
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
