import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import type {
    CreateUserProfilePayload,
    UpdateUserProfilePayload,
    UserProfile,
    ApiResponse,
} from "@/types/user";

// ─────────────────────────────────────────────
// GET /api/user?id=<user_id>
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Query parameter 'id' is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();
        const { data, error } = await supabase
            .from(TABLES.USERS)
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse<UserProfile>>({
            success: true,
            data: data as UserProfile,
        });
    } catch (error) {
        console.error("[GET /api/user] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}

// ─────────────────────────────────────────────
// POST /api/user  — create a new user profile
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body: CreateUserProfilePayload = await req.json();

        if (!body.email?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "email is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();
        const { data, error } = await supabase
            .from(TABLES.USERS)
            .insert({
                email: body.email.toLowerCase().trim(),
                full_name: body.full_name ?? null,
                domain: body.domain ?? null,
                education_level: body.education_level ?? null,
                skills: body.skills ?? [],
                interests: body.interests ?? [],
                target_career: body.target_career ?? null,
            })
            .select()
            .single();

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: "A user with this email already exists." },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json<ApiResponse<UserProfile>>(
            { success: true, data: data as UserProfile, message: "User profile created." },
            { status: 201 }
        );
    } catch (error) {
        console.error("[POST /api/user] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}

// ─────────────────────────────────────────────
// PATCH /api/user?id=<user_id>  — update profile
// ─────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Query parameter 'id' is required." },
                { status: 400 }
            );
        }

        const body: UpdateUserProfilePayload = await req.json();
        const supabase = getServerSupabase();

        const { data, error } = await supabase
            .from(TABLES.USERS)
            .update({ ...body, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json<ApiResponse<UserProfile>>({
            success: true,
            data: data as UserProfile,
            message: "User profile updated.",
        });
    } catch (error) {
        console.error("[PATCH /api/user] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}
