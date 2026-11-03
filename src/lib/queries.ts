import { useMutation, useQueries, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { useAuthUser } from "./auth"
import * as data from "./data"
import type { Partnership, Profile, Role } from "./types"

// All database reads go through TanStack Query (cached, deduplicated, refetched on focus);
// every write is a mutation that invalidates the queries it affects.

export const keys = {
  profile: (uid: string) => ["profile", uid] as const,
  search: (role: Role, category: string) => ["profiles", role, category] as const,
  contacts: (uid: string) => ["contacts", uid] as const,
  connection: (me: string, other: string) => ["connection", data.pairId(me, other)] as const,
  connections: (uid: string) => ["connections", uid] as const,
  partnerships: (uid: string) => ["partnerships", uid] as const,
  partnership: (id: string) => ["partnership", id] as const,
  results: (uid: string) => ["results", "mine", uid] as const,
  partnershipResults: (id: string) => ["results", "partnership", id] as const
}

// Reads

export const useProfile = (uid: string | undefined) =>
  useQuery({
    queryKey: keys.profile(uid ?? ""),
    queryFn: () => data.getProfile(uid as string),
    enabled: Boolean(uid)
  })

/** The signed-in user and their profile. `profile` is null when they haven't created one yet. */
export function useAuth() {
  const { user, ready } = useAuthUser()
  const profile = useProfile(user?.id)
  return {
    user,
    profile: profile.data ?? null,
    loading: !ready || (user !== null && profile.isPending)
  }
}

/** Public profiles for a set of uids, keyed by uid. Shares the cache with useProfile. */
export function useProfiles(uids: readonly string[]): Partial<Record<string, Profile | null>> {
  const unique = [...new Set(uids)]
  return useQueries({
    queries: unique.map((uid) => ({ queryKey: keys.profile(uid), queryFn: () => data.getProfile(uid) })),
    combine: (results) => Object.fromEntries(unique.map((uid, i) => [uid, results[i]?.data]))
  })
}

export const useSearchProfiles = (role: Role, category: string) =>
  useQuery({ queryKey: keys.search(role, category), queryFn: () => data.searchProfiles({ role, category }) })

export const useContacts = (uid: string, enabled = true) =>
  useQuery({ queryKey: keys.contacts(uid), queryFn: () => data.getContacts(uid), enabled })

export const useConnection = (me: string | undefined, other: string) =>
  useQuery({
    queryKey: keys.connection(me ?? "", other),
    queryFn: () => data.getConnection(me as string, other),
    enabled: Boolean(me) && me !== other
  })

export const useMyConnections = (uid: string) =>
  useQuery({ queryKey: keys.connections(uid), queryFn: () => data.getMyConnections(uid) })

export const useMyPartnerships = (uid: string) =>
  useQuery({ queryKey: keys.partnerships(uid), queryFn: () => data.getMyPartnerships(uid) })

export const usePartnership = (id: string) =>
  useQuery({ queryKey: keys.partnership(id), queryFn: () => data.getPartnership(id) })

export const useMyResults = (uid: string) => useQuery({ queryKey: keys.results(uid), queryFn: data.getMyResults })

export const usePartnershipResults = (partnership: Partnership | null | undefined) =>
  useQuery({
    queryKey: keys.partnershipResults(partnership?.id ?? ""),
    queryFn: () => data.getPartnershipResults((partnership as Partnership).id),
    enabled: Boolean(partnership)
  })

// Writes

function useWrite<TVars, TResult>(mutationFn: (vars: TVars) => Promise<TResult>, invalidates: readonly QueryKey[]) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => Promise.all(invalidates.map((queryKey) => client.invalidateQueries({ queryKey })))
  })
}

// Prefix keys: invalidating ["connections"] refreshes every user's connection list, and so on.
const CONNECTIONS = [["connection"], ["connections"]] as const
const PARTNERSHIPS = [["partnership"], ["partnerships"]] as const
const RESULTS = [["results"]] as const

export const useCreateProfile = () => useWrite(data.createProfile, [["profile"], ["profiles"], ["contacts"]])

export const useSaveProfile = () => useWrite(
  async ({ uid, fields, contacts }: { uid: string; fields: Parameters<typeof data.updateProfile>[1]; contacts: Parameters<typeof data.saveContacts>[1] }) => {
    await Promise.all([data.updateProfile(uid, fields), data.saveContacts(uid, contacts)])
  },
  [["profile"], ["profiles"], ["contacts"]]
)

export const useRequestConnection = () => useWrite(data.requestConnection, CONNECTIONS)
export const useRespondToConnection = () => useWrite(data.respondToConnection, CONNECTIONS)
export const useRemoveConnection = () => useWrite(data.removeConnection, CONNECTIONS)

export const useCreatePartnership = () => useWrite(data.createPartnership, PARTNERSHIPS)
export const useSetPartnershipStatus = () => useWrite(data.setPartnershipStatus, PARTNERSHIPS)

export const useAddResult = () => useWrite(data.addResult, RESULTS)
export const useDeleteResult = () => useWrite(data.deleteResult, RESULTS)

export const useExportMyData = () => useMutation({ mutationFn: data.exportMyData })

/** Deletes the account and drops every cached read, since they belonged to that user. */
export function useDeleteMyAccount() {
  const client = useQueryClient()
  return useMutation({ mutationFn: data.deleteMyAccount, onSuccess: () => client.clear() })
}
