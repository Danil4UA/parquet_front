export const COMMON_STYLES = {
  input: `
    w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
    dark:bg-gray-800 dark:text-white transition-all duration-200
  `,
  button: `
    w-full h-12 bg-black dark:bg-white dark:text-black text-white font-semibold rounded-lg
    hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
    focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600
  `,
  radioContainer: `
    h-12 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
  `,
  radioContainerActive: `
    border-black bg-gray-50 dark:bg-gray-950/20
  `,
  radioContainerInactive: `
    border-gray-200 dark:border-gray-700 hover:border-gray-300
  `,
  sectionTitle: `
    text-lg font-semibold text-gray-900 dark:text-white
  `,
  promoInput: `
    flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
    dark:bg-gray-800 dark:text-white transition-all duration-200
  `,
  promoButton: `
    px-4 py-2 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-sm font-medium rounded-lg
    hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200
  `
};

export const getInputClass = (isHebrew: boolean) => 
  `${COMMON_STYLES.input} ${isHebrew ? "hebrew-text text-right" : ""}`;

export const getSectionTitleClass = (isHebrew: boolean) => 
  `${COMMON_STYLES.sectionTitle} ${isHebrew ? "hebrew-text text-right" : ""}`;
