import React from "react";
import { GraduationCap, Heart, Github, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1 bg-blue-600 rounded text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Unipedia
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm text-[11px]">
              Discover top Indian engineering and science institutes. Unipedia provides verified data on annual academic fees, placements metrics, NIRF reviews, and interactive multi-college comparisons to simplify your choice.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-[11px] font-bold tracking-wider uppercase mb-2">Features</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <a href="#discovery" className="hover:text-white transition-colors">College Directory</a>
              </li>
              <li>
                <a href="#compare" className="hover:text-white transition-colors">Side-by-side Compare</a>
              </li>
              <li>
                <a href="#shortlist" className="hover:text-white transition-colors">Personal Shortlist</a>
              </li>
              <li>
                <a href="#placements" className="hover:text-white transition-colors">Placement Insights</a>
              </li>
            </ul>
          </div>

          {/* Contact Details / Disclaimer */}
          <div>
            <h4 className="text-white text-[11px] font-bold tracking-wider uppercase mb-2">Academic MVP</h4>
            <ul className="space-y-1.5 text-slate-450 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Inspired by Collegedunia & Careers360
              </li>
              <li className="text-slate-400">
                Verified realistic placement statistics
              </li>
              <li className="text-slate-400">
                Developed in full-stack Node container
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-6 pt-5 border-t border-slate-850 text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Unipedia College Discovery Platform.</p>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for academic excellence.
          </div>
        </div>
      </div>
    </footer>
  );
}
