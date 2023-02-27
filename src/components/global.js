export const globalComponents = {
  AppDialog: () => import('@/components/ui/AppDialog'),
  AppDeleteIcon: () => import('@/components/ui/AppDeleteIcon'),
  AppHeading: () => import('@/components/ui/AppHeading')
}

export const registerGlobalComponents = instance =>
  Object.entries(globalComponents).forEach(([name, component]) =>
    instance.component(name, component)
  )
