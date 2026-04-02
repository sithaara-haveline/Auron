'use client'
import { useState } from 'react'
import { BookOpen, ExternalLink, Star } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  url: string
  rating: number
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'LeetCode',
    description: 'Practice coding problems and interview preparation',
    category: 'Technical',
    url: 'https://leetcode.com',
    rating: 5
  },
  {
    id: '2',
    title: 'System Design Primer',
    description: 'Learn system design concepts',
    category: 'Technical',
    url: 'https://github.com/donnemartin/system-design-primer',
    rating: 5
  },
  {
    id: '3',
    title: 'LinkedIn Learning',
    description: 'Professional skill development courses',
    category: 'Career',
    url: 'https://www.linkedin.com/learning',
    rating: 4
  },
  {
    id: '4',
    title: 'Coursera',
    description: 'University-level courses on various topics',
    category: 'Educational',
    url: 'https://www.coursera.org',
    rating: 5
  },
  {
    id: '5',
    title: 'Udemy',
    description: 'Affordable online courses across all domains',
    category: 'Educational',
    url: 'https://www.udemy.com',
    rating: 4
  },
  {
    id: '6',
    title: 'GitHub',
    description: 'Build your portfolio with open-source projects',
    category: 'Portfolio',
    url: 'https://github.com',
    rating: 5
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = [...new Set(resources.map(r => r.category))]
  
  const filtered = selectedCategory 
    ? resources.filter(r => r.category === selectedCategory)
    : resources

  return (
    <div style={{ marginLeft: '280px', padding: '40px 48px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <BookOpen size={32} color="var(--color-caramel)" />
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-caramel)', margin: 0 }}>
            Resources
          </h1>
        </div>
        <p style={{ color: 'var(--color-warm-greige)', fontSize: 15 }}>
          Curated learning materials and tools to accelerate your growth
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: selectedCategory === null ? 'var(--color-caramel)' : '#ede9e3',
            color: selectedCategory === null ? 'white' : 'var(--color-caramel)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          All Resources
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: selectedCategory === cat ? 'var(--color-caramel)' : '#ede9e3',
              color: selectedCategory === cat ? 'white' : 'var(--color-caramel)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24
      }}>
        {filtered.map(resource => (
          <div
            key={resource.id}
            style={{
              background: 'white',
              border: '1px solid var(--color-card-border)',
              borderRadius: 12,
              padding: 24,
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-caramel)', marginBottom: 4 }}>
                {resource.title}
              </h3>
              <div style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 8px',
                background: '#f0ede8',
                color: 'var(--color-caramel)',
                borderRadius: 4
              }}>
                {resource.category}
              </div>
            </div>

            <p style={{
              fontSize: 14,
              color: 'var(--color-warm-greige)',
              marginBottom: 16,
              lineHeight: 1.5
            }}>
              {resource.description}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < resource.rating ? 'var(--color-caramel)' : '#ddd'}
                    color={i < resource.rating ? 'var(--color-caramel)' : '#ddd'}
                  />
                ))}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: 'var(--color-caramel)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                Visit <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
