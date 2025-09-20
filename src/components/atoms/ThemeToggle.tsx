import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useThemeStore } from '../../stores/themeStore';

const themeIcons = {
  light: '☀️',
  dark: '🌙',
  system: '🔄'
};

const themeLabels = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema'
};

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          className="text-lg"
          aria-label="Cambiar tema"
        >
          {themeIcons[theme]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Selección de tema"
        selectedKeys={[theme]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedTheme = Array.from(keys)[0] as typeof theme;
          setTheme(selectedTheme);
        }}
      >
        <DropdownItem key="light" startContent={themeIcons.light}>
          {themeLabels.light}
        </DropdownItem>
        <DropdownItem key="dark" startContent={themeIcons.dark}>
          {themeLabels.dark}
        </DropdownItem>
        <DropdownItem key="system" startContent={themeIcons.system}>
          {themeLabels.system}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};