
const menus  = [
    {
      key : '/language',
      label : 'Language',
      link : '/language'
    },
    {
     key : '/header',
     label : 'Header',
     link : '/header'
    },
    {
    key : '/slide',
    label : 'Slide',
    link : '/slide'
    },
    {
        key : '/about',
        label : 'About',
        children : [
            {
                key : '/companyDescription',
                label : 'Company description',
                link : '/about/companyDescription'
            },
            {
                key : '/about/companyFigures',
                label : 'Company Figures',
                link : '/about/companyFigures'
            },
            {
                key : '/about/companyStatics',
                label : 'Company Statics',
                link : '/about/companyStatics'
            },
            {
                key : '/about/companyMembers',
                label : 'Company Member',
                link : '/about/companyMembers'
            },
            {
                key : '/about/socialMedia',
                label : 'Social Media',
                link : '/about/socailMedia'
            },
            {
                key : '/about/partners',
                label : 'Partners',
                link : '/about/partners'
            }

        ]
    },
    {
        key : '/service',
        label : 'Service ',
        link : '/service'
    },
    {
        key : '/news',
        label : 'News ',
        link : '/news'
    },
    {
        key : '/faqs',
        label : 'FAQ ',
        link : '/faqs'
    },
    {
        key : '/vacancy',
        label : 'Vacancy ',
        link : '/vacancy'
    }, 
]
export default menus