import React from 'react';
import { Twitter, Linkedin, Github, Instagram, ArrowUpRight } from 'lucide-react';
import contentData from '../data/content.json';

const Footer = () => {
    const { contact, navigation } = contentData;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-stone-950 text-stone-400 py-20 px-6 md:px-20 border-t border-stone-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">

                {/* 1. Brand / Intro */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-stone-100 font-serif text-3xl md:text-4xl italic">
                        Alfredo Mendoza.
                    </h2>
                    <p className="max-w-md text-sm md:text-base font-light leading-relaxed">
                        {contact.eyebrow}
                    </p>
                    <div className="flex gap-4 pt-4">
                        {/* Social Icons - mapping manually for more control or could map from JSON if structured */}
                        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
                            <span className="sr-only">WhatsApp</span>
                            <ArrowUpRight size={20} />
                        </a>
                        {/* Placeholder for generic social links if not in JSON explicitly */}
                        <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
                            {/* Lucide doesn't have TikTok standard, using generic or text */}
                            <span className="font-bold text-xs uppercase tracking-wider border border-current px-1 rounded">TK</span>
                        </a>
                    </div>
                </div>

                {/* 2. Navigation */}
                <div className="space-y-6">
                    <h3 className="text-stone-100 uppercase tracking-widest text-xs font-bold">Menu</h3>
                    <ul className="space-y-3">
                        {navigation.links.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.id === 'blog' ? '/blog' : `/#${link.id}`}
                                    className="text-sm hover:text-terracotta transition-colors inline-block"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Contact */}
                <div className="space-y-6">
                    <h3 className="text-stone-100 uppercase tracking-widest text-xs font-bold">Contacto</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href={`mailto:${contact.email}`} className="text-sm hover:text-terracotta transition-colors break-all">
                                {contact.email}
                            </a>
                        </li>
                        <li>
                            <a href={`https://wa.me/${contact.whatsapp.replace('+', '')}`} className="text-sm hover:text-terracotta transition-colors">
                                WhatsApp
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider opacity-60">
                <p>&copy; {currentYear} {contact.copyright}</p>
                <div className="flex gap-6">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
