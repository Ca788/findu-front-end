import Typography from '@mui/material/Typography';

export function SidebarBrand() {
  return (
    <div className="flex h-16 items-center px-6">
      <Typography
        variant="h6"
        component="span"
        className="font-semibold tracking-tight"
      >
        FindU
      </Typography>
    </div>
  );
}
