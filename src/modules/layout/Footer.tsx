import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1c1e] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
          <div className="col-span-2 md:col-span-1">
            <div className="font-condensed text-2xl font-black text-white mb-3">
              AUTO<span className="text-[#E8181A]">PARTS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Надёжный поставщик автозапчастей в Эстонии и странах Балтии. Более 500 000 артикулов от ведущих производителей.
            </p>
          </div>
          {[
            { title: 'Покупателям', links: ['Как сделать заказ', 'Доставка и оплата', 'Возврат товара', 'Гарантия'] },
            { title: 'Доставка', links: ['Omniva пакоматы', 'DPD курьер', 'Самовывоз', 'Международная'] },
            { title: 'Контакты', links: ['📍 Таллин, Эстония', '📞 +372 5XXX XXXX', '✉️ info@autoparts.ee'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-condensed text-sm font-bold uppercase tracking-wider mb-4">{col.title}</h4>
              <div className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <Link key={l} href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-5 gap-3 text-gray-600 text-xs">
          <span>© 2025 AutoParts. Все права защищены. OÜ AUTOPARTS | Reg: 1234567</span>
          <div className="flex items-center gap-2 text-lg">💳 🏦 📱 <span className="text-xs text-gray-600">Maksekeskus</span></div>
        </div>
      </div>
    </footer>
  )
}
