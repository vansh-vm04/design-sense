import { motion } from 'framer-motion'

const CreativeNavbar = () => {
  const navItems = ['About', 'Projects', 'Blogs', 'Services', 'Socials']

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-sky-200 px-2 pt-3 custom-cursor sm:px-4">
      <nav className="w-full max-w-260 rounded-[18px] border border-black/35 bg-[#f6f1e4] py-6 shadow-[0_2px_0_rgba(0,0,0,0.08)] sm:px-6 md:px-7 overflow-hidden flex items-center justify-center">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-40 text-[24px] leading-none text-black font-[cursive] sm:text-[36px]">
            Vansh
          </div>

          <ul className="items-center gap-4 text-[18px] font-medium text-[#1a1a1a] lg:flex overflow-hidden px-4">
            {navItems.map((item) => (
              <li className="relative" key={item}>
                <motion.a
                  href="#"
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  className="relative block rounded-4xl border border-transparent px-2 py-1.5"
                >
                  <motion.span
                    variants={{
                      rest: { opacity: 1, y: 0, rotate: 0 },
                      hover: { opacity: 0, y: -40, rotate: 30 },
                    }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="block"
                  >
                    {item}
                  </motion.span>

                  <motion.div
                    variants={{
                      rest: { opacity: 0, y: 40, rotate: -30 },
                      hover: { keyTimes: [0, 0.5, 1], opacity: [0, 1, 1], y: [40, -5, 0], rotate: [0, 0, 0] },
                    }}
                    transition={{ duration: 0.30, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center rounded-4xl border border-black bg-[#6ea8cc]"
                  >
                   <motion.span
                    variants={{
                      rest: { opacity: 0, y: 40, rotate: -30 },
                      hover: { keyTimes: [0, 0.2, 1], opacity: [0, 1, 1], y: [40, -7, 0], rotate: [0, 0, 0] },
                    }}
                    transition={{ duration: 0.42, ease: 'easeInOut' }}
                    className="block"
                  >
                    {item}
                  </motion.span>
                  </motion.div>
                </motion.a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-[10px] border border-black/60 bg-[#f6f1e4] px-4 py-2 text-[18px] font-medium text-black transition-colors duration-200 hover:bg-[#eee6d5] sm:px-8"
            >
              Contact Me
            </button>

            <button
              type="button"
              className="rounded-[10px] border border-black/60 bg-[#6ea8cc] px-4 py-2 text-[18px] font-medium text-black transition-colors duration-200 hover:bg-[#5b98bf] sm:px-8"
            >
              Resume
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default CreativeNavbar