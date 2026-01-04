import React from 'react';
import { FinRecord } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RecordCardProps {
  record: FinRecord;
  onClick?: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Income: ArrowUp,
  Expense: ArrowDown,
  'Net Profit': DollarSign
};

const colorMap: Record<string, string> = {
  Income: '#16a34a',
  Expense: '#ef4444',
  'Net Profit': '#0f6fff'
};

export function RecordCard({ record, onClick }: RecordCardProps) {
  const Icon = iconMap[record.type] || DollarSign;
  const color = colorMap[record.type] || '#0f6fff';

  const displayDate = record.dueDate || record.createdAt;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-none shadow-sm hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>

          {/* Text content */}
          <div className="flex-1 flex flex-col">
            {/* Type */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {record.type}
            </p>

            {/* Title */}
            <p className="text-base font-semibold text-foreground">
              {record.title}
            </p>

            {/* Notes */}
            {record.notes && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                {record.notes}
              </p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="flex flex-col items-end justify-start shrink-0">
            <p className="text-lg md:text-xl font-bold" style={{ color }}>
              {formatCurrency(record.amount)}
            </p>
            {displayDate && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(displayDate)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
