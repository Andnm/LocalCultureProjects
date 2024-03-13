interface ListWrapperProps {
  children: React.ReactNode;
}

export const ListWrapper = ({ children }: ListWrapperProps) => {
  return (
    <li
      className="shrink-0 h-full w-[272px] select-none"
      style={{ listStyle: "none" }}
    >
      <div className="h-[80px]"></div>
      {children}
    </li>
  );
};
