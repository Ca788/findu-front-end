import Typography from '@mui/material/Typography';

interface UserMenuHeaderProps {
  name?: string | null;
  email?: string | null;
}

export function UserMenuHeader({ name, email }: UserMenuHeaderProps) {
  return (
    <div className="px-4 py-2">
      <Typography variant="body2" className="font-medium">
        {name ?? 'Usuário'}
      </Typography>
      {email && (
        <Typography variant="caption" color="text.secondary">
          {email}
        </Typography>
      )}
    </div>
  );
}
