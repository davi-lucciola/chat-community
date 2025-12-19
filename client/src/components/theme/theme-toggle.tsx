import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToogle() {
  const { theme, setTheme } = useTheme();
  const themeToSet = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(themeToSet)}>
      {themeToSet === 'dark' && <Moon className="absolute h-[1.2rem] w-[1.2rem] " />}
      {themeToSet === 'light' && <Sun className="h-[1.2rem] w-[1.2rem] scale-100 " />}
    </Button>
  );
}
