'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

export default function Studio() {
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <NextStudio config={config} />
        </div>
    )
}
