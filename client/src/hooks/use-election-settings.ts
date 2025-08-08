import { useState, useEffect } from "react";
import type { ElectionSettings } from "@shared/schema";

const STORAGE_KEY = "decentralvote_election_settings";

// Default settings
const defaultSettings: ElectionSettings = {
  registrationDeadline: null,
  votingStartTime: null,
  votingEndTime: null,
  isRegistrationOpen: true,
  isVotingOpen: true,
  canUpdateSettings: true,
};

export function useElectionSettings() {
  const [settings, setSettings] = useState<ElectionSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Failed to load election settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check deadlines and update status
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      let needsUpdate = false;
      const newSettings = { ...settings };

      // Check registration deadline
      if (settings.registrationDeadline) {
        const regDeadline = new Date(settings.registrationDeadline);
        const regExpired = now > regDeadline;

        if (settings.isRegistrationOpen && regExpired) {
          newSettings.isRegistrationOpen = false;
          needsUpdate = true;
        }
      }

      // Check voting start time
      if (settings.votingStartTime) {
        const votingStart = new Date(settings.votingStartTime);
        const votingStarted = now >= votingStart;

        if (!settings.isVotingOpen && votingStarted && settings.votingEndTime) {
          const votingEnd = new Date(settings.votingEndTime);
          const votingNotEnded = now < votingEnd;

          if (votingNotEnded) {
            newSettings.isVotingOpen = true;
            needsUpdate = true;
          }
        }
      }

      // Check voting end time
      if (settings.votingEndTime) {
        const votingEnd = new Date(settings.votingEndTime);
        const votingExpired = now > votingEnd;

        if (settings.isVotingOpen && votingExpired) {
          newSettings.isVotingOpen = false;
          needsUpdate = true;
        }

        // Allow settings update only after voting ends
        if (!settings.canUpdateSettings && votingExpired) {
          newSettings.canUpdateSettings = true;
          needsUpdate = true;
        } else if (
          settings.canUpdateSettings &&
          !votingExpired &&
          (settings.registrationDeadline || settings.votingStartTime)
        ) {
          // Prevent updates once any deadline is set and not expired
          newSettings.canUpdateSettings = false;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        setSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      }
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  const updateSettings = (newSettings: Partial<ElectionSettings>) => {
    if (!settings.canUpdateSettings) {
      throw new Error(
        "Election settings cannot be updated while election is active"
      );
    }

    const updated = { ...settings, ...newSettings };

    // Validate dates
    if (updated.registrationDeadline && updated.votingStartTime) {
      const regDeadline = new Date(updated.registrationDeadline);
      const votingStart = new Date(updated.votingStartTime);

      if (regDeadline >= votingStart) {
        throw new Error(
          "Registration deadline must be before voting start time"
        );
      }
    }

    if (updated.votingStartTime && updated.votingEndTime) {
      const votingStart = new Date(updated.votingStartTime);
      const votingEnd = new Date(updated.votingEndTime);

      if (votingStart >= votingEnd) {
        throw new Error("Voting start time must be before voting end time");
      }
    }

    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetSettings = () => {
    if (!settings.canUpdateSettings) {
      throw new Error(
        "Election settings cannot be reset while election is active"
      );
    }

    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };
}
