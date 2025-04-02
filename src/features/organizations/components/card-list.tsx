"use client";
import { useState } from "react";

import { organizations } from "@/features/organizations/data";
import { OrganizationCard } from "@/features/organizations/components/organization-card";
import { SearchBar } from "@/features/organizations/components/search-bar";
import AddButton from "@/features/organizations/components/add-new-button";

export default function CardList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex items-center">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <AddButton />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrganizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>
      {filteredOrganizations.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">
          No organizations found.
        </p>
      )}
    </div>
  );
}
