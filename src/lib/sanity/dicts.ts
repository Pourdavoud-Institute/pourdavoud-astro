/** Dictionaries to easily look up Sanity document IDs for workspaces, categories, etc. */
export const SanityPeopleCategories = {
    affiliate: {
        id: 'cae812fd-2c96-437c-9c75-8b3a04307be5',
        name: 'Affiliate',
    },
    faculty: {
        id: 'c852a954-828d-4d81-8c1e-39299b23e5a7',
        name: 'Faculty',
    },
    gradStudent: {
        id: '226fe6c7-8fcf-4f83-a69c-6bd83c4a00fd',
        name: 'Grad Student',
    },
    speaker: {
        id: '928cfac5-6cbc-459c-85ea-e45add439ee1',
        name: 'Speaker',
    },
    staff: {
        id: 'c1521379-8de4-4b5d-9e0f-5765f2a4d62e',
        name: 'Staff',
    },
};

export const SanityUCLADepartments: Record<string, string> = {
    'art-history': 'Art History',
    alc: 'Asian Languages & Cultures',
    classics: 'Classics',
    cmrs: 'Center for Medieval and Renaissance Studies',
    history: 'History',
    nelc: 'Near Eastern Languages and Cultures',
};
