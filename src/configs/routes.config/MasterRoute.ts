import { lazy } from 'react'
//import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const MasterRoute: Routes = [
    {
        key: 'MasterMenu.Demarcation',
        path: '/Master-menu-Demarcation',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Demarcation'),
        ),
        authority: [],
    },
    {
        key: 'MasterMenu.DistributorMapping',
        path: '/Master-menu-DistributorMapping',
        component: lazy(
            () =>
                import(
                    '@/views/MasterSettings/DistributorMapping/DistributorMapping'
                ),
        ),
        authority: [],
    },
    {
        key: 'MasterMenu.collapse.FinalGeography',
        path: '/Master-menu-FinalGeography',
        component: lazy(
            () =>
                import('@/views/MasterSettings/FinalGeography/FinalGeography'),
        ),
        authority: [],
    },

    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation/:id/Channel',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Edit/ChannelEdit'),
        ),
        authority: [],
    },
    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation/:id/SubChannel',
        component: lazy(
            () =>
                import(
                    '@/views/MasterSettings/Demarcation/Edit/SubChannelEdit'
                ),
        ),
        authority: [],
    },
    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation-/:id/Region',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Edit/RegionEdit'),
        ),
        authority: [],
    },

    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation-/:id/Area',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Edit/AreaEdit'),
        ),
        authority: [],
    },

    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation-/:id/Area',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Edit/AreaEdit'),
        ),
        authority: [],
    },

    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation-/:id/Territory',
        component: lazy(
            () =>
                import('@/views/MasterSettings/Demarcation/Edit/TerritoryEdit'),
        ),
        authority: [],
    },
    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation-/:id/Route',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Edit/RouteEdit'),
        ),
        authority: [],
    },
    {
        key: 'MasterMenu.collapse.Demarcation',
        path: '/Master-menu-Demarcation-/:id/Agency',
        component: lazy(
            () => import('@/views/MasterSettings/Demarcation/Edit/AgencyEdit'),
        ),
        authority: [],
    },

    {
        key: 'MasterMenu.collapse.DistributorEdit',
        path: '/Master-menu-DistributorMapping/edit/:id',
        component: lazy(
            () =>
                import(
                    '@/views/MasterSettings/DistributorMapping/Edit/DistributorEdit'
                ),
        ),
        authority: [],
    },

    {
        key: 'MasterMenu.collapse.DistributorAgencyEdit',
        path: '/Master-menu-DistributorMapping/agency-edit/:id',
        component: lazy(
            () =>
                import(
                    '@/views/MasterSettings/DistributorMapping/Edit/DistributorAgencyEdit'
                ),
        ),
        authority: [],
    },
]

export default MasterRoute
