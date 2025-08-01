import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { FiMapPin, FiMap, FiHome } from 'react-icons/fi'

function Achievement() {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Area',
      icon: <FiMapPin className="text-4xl text-red-600 mb-2" />,
      route: '/Reports-menu-AchievementArea',
    },
    {
      title: 'Territory',
      icon: <FiMap className="text-4xl text-red-600 mb-2" />,
      route: '/Reports-menu-AchievementTerritory',
    },
    {
      title: 'Shop',
      icon: <FiHome className="text-4xl text-red-600 mb-2" />,
      route: '/Reports-menu-AchievementShop',
    },
  ]

  return (
    <div className="min-h-[80vh] px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Achievement - Category Wise
      </h1>
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer"
            onClick={() => navigate(card.route)}
          >
            <Card className="p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex items-center gap-4">
              {card.icon}
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
                <p className="text-sm text-gray-500">View {card.title} wise achievement report</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Achievement
