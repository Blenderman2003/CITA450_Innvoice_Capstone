export const customStyles = (theme) => ({
    control: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
      color: theme === "dark" ? "#ffffff" : "#000000",
      boxShadow: "none",
      "&:hover": {
        borderColor: theme === "dark" ? "#6b7280" : "#9ca3af",
      },
    }),
    input: (base) => ({
      ...base,
      color: theme === "dark" ? "#ffffff" : "#000000",
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#ffffff" : "#000000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "#374151"
          : "#e5e7eb"
        : "transparent",
      color: theme === "dark" ? "#ffffff" : "#000000",
    }),
  });