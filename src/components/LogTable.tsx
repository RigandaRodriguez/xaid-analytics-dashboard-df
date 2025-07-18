
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/types/logging';
import { format } from 'date-fns';
import { ru, enUS, es, de } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface LogTableProps {
  logs: LogEntry[];
  selectedLogs: string[];
  onSelectLog: (logId: string) => void;
  onSelectAll: (checked: boolean) => void;
  viewMode?: 'compact' | 'full';
}

const LogTable = ({ logs, selectedLogs, onSelectLog, onSelectAll, viewMode = 'full' }: LogTableProps) => {
  const { t, language } = useLanguage();


  const getLocale = () => {
    return ru; // Only Russian is supported
  };

  const isAllSelected = logs.length > 0 && selectedLogs.length === logs.length;
  const isIndeterminate = selectedLogs.length > 0 && selectedLogs.length < logs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('logging.logEntriesCount', { count: logs.length })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onSelectAll}
                    className={isIndeterminate ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </TableHead>
                <TableHead>{t('logging.timestamp')}</TableHead>
                <TableHead>{t('logging.action')}</TableHead>
                {viewMode === 'full' && <TableHead>{t('logging.studyUid')}</TableHead>}
                {viewMode === 'full' && <TableHead>{t('logging.patientId')}</TableHead>}
                <TableHead>{t('logging.details')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLogs.includes(log.id)}
                      onCheckedChange={() => onSelectLog(log.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {format(log.timestamp, viewMode === 'compact' ? 'dd.MM HH:mm' : 'dd.MM.yyyy HH:mm', { locale: getLocale() })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.action}
                  </TableCell>
                  {viewMode === 'full' && (
                    <TableCell className="font-mono text-sm">
                      {log.studyUid}
                    </TableCell>
                  )}
                  {viewMode === 'full' && (
                    <TableCell className="font-mono text-sm">
                      {log.patientId}
                    </TableCell>
                  )}
                  <TableCell className={viewMode === 'compact' ? 'max-w-xs truncate' : 'max-w-xs truncate'}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogTable;
