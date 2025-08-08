import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import type { Countdown } from "@shared/schema";

interface CountdownTimerProps {
  targetDate: string | null;
  title: string;
  description?: string;
  variant?: "registration" | "voting" | "default";
}

export function CountdownTimer({
  targetDate,
  title,
  description,
  variant = "default",
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 text-center">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xs text-gray-500">Not set</p>
        </CardContent>
      </Card>
    );
  }

  const getVariantStyles = () => {
    if (countdown.isExpired) {
      return {
        bgClass: "bg-red-50 border-red-200",
        textClass: "text-red-900",
        iconClass: "text-red-600",
        timeClass: "text-red-700",
        icon: CheckCircle,
      };
    }

    switch (variant) {
      case "registration":
        return {
          bgClass: "bg-blue-50 border-blue-200",
          textClass: "text-blue-900",
          iconClass: "text-blue-600",
          timeClass: "text-blue-700",
          icon: Clock,
        };
      case "voting":
        return {
          bgClass: "bg-green-50 border-green-200",
          textClass: "text-green-900",
          iconClass: "text-green-600",
          timeClass: "text-green-700",
          icon: Clock,
        };
      default:
        return {
          bgClass: "bg-gray-50 border-gray-200",
          textClass: "text-gray-900",
          iconClass: "text-gray-600",
          timeClass: "text-gray-700",
          icon: Clock,
        };
    }
  };

  const styles = getVariantStyles();
  const Icon = styles.icon;

  return (
    <Card className={styles.bgClass}>
      <CardContent className="p-4 text-center">
        <Icon className={`w-6 h-6 ${styles.iconClass} mx-auto mb-2`} />
        <p className={`text-sm font-medium ${styles.textClass} mb-1`}>
          {title}
        </p>

        {countdown.isExpired ? (
          <div>
            <p className="text-lg font-bold text-red-700 mb-1">EXPIRED</p>
            <p className="text-xs text-red-600">Deadline has passed</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-1 mb-2">
              <div className="text-center">
                <p className={`text-lg font-bold ${styles.timeClass}`}>
                  {countdown.days}
                </p>
                <p className="text-xs text-gray-600">Days</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${styles.timeClass}`}>
                  {countdown.hours}
                </p>
                <p className="text-xs text-gray-600">Hours</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${styles.timeClass}`}>
                  {countdown.minutes}
                </p>
                <p className="text-xs text-gray-600">Mins</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${styles.timeClass}`}>
                  {countdown.seconds}
                </p>
                <p className="text-xs text-gray-600">Secs</p>
              </div>
            </div>
            {description && (
              <p className="text-xs text-gray-600">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
