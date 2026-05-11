import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useLanguage } from '../context/LanguageContext';
import { contactTranslations } from '../translations/contact';

export default function Form() {
  const { lang } = useLanguage();
  const t = contactTranslations[lang].form;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", comments: "" });

  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      from_name: clientInfo.name,
      from_email: clientInfo.email,
      phone: clientInfo.phone,
      message: clientInfo.comments,
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatus("success");
        setClientInfo({ name: "", email: "", phone: "", comments: "" });
      })
      .catch(() => setStatus("error"))
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setStatus(""), 5000);
      });
    };

  return (
    <form onSubmit={sendEmail} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.nameLabel}</label>
          <input
            name="name"
            required
            value={clientInfo.name}
            onChange={handleClientInfoChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.emailLabel}</label>
          <input
            name="email"
            type="email"
            required
            value={clientInfo.email}
            onChange={handleClientInfoChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.phoneLabel}</label>
        <input
          name="phone"
          type="tel"
          required
          value={clientInfo.phone}
          onChange={handleClientInfoChange}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.messageLabel}</label>
        <textarea
          name="comments"
          required
          rows={4}
          value={clientInfo.comments}
          onChange={handleClientInfoChange}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
      >
        {isSubmitting ? "..." : t.submitLabel}
      </button>

      {status === "success" && <p className="text-emerald-400 text-center font-medium text-sm">Message envoyé !</p>}
      {status === "error" && <p className="text-red-400 text-center font-medium text-sm">Erreur, réessayez.</p>}
    </form>
  );
}