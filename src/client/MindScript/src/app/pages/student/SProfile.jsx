import React from 'react'
import { ProfileLayout } from '../../layout'

export const SProfile = () => {
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]
    return (
        <ProfileLayout pages={pages}>

        </ProfileLayout>
    )
}
