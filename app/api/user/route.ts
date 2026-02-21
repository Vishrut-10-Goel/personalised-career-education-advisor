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
        const email = searchParams.get("email");

        if (!id && !email) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Query parameter 'id' or 'email' is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();
        let query = supabase.from(TABLES.USERS).select("*");

        if (id) {
            query = query.eq("id", id);
        } else if (email) {
            const normalizedEmail = email.toLowerCase().trim();
            const password = searchParams.get("password");

            query = query.eq("email", normalizedEmail);

            const { data, error } = await query.maybeSingle();
            if (error) throw error;
            if (!data) return NextResponse.json<ApiResponse>({ success: false, error: "User not found." }, { status: 404 });

            // Manual password verification
            if (password && data.password !== password) {
                return NextResponse.json<ApiResponse>({ success: false, error: "Invalid password." }, { status: 401 });
            }

            return NextResponse.json<ApiResponse<UserProfile>>({ success: true, data: data as UserProfile });
        }

        const { data, error } = await query.maybeSingle();

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
    } catch (error: any) {
        console.error("[GET /api/user] Detailed Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: (error?.message) || (typeof error === 'string' ? error : JSON.stringify(error)) || "An unexpected error occurred.",
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

        if (!body.id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "user id is required." },
                { status: 400 }
            );
        }

        if (!body.email?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "email is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();
        const { data, error } = await supabase
            .from(TABLES.USERS)
            .upsert({
                id: body.id,
                email: body.email.toLowerCase().trim(),
                full_name: body.full_name ?? null,
                domain: body.domain ?? null,
                education_level: body.education_level ?? null,
                skills: body.skills ?? [],
                interests: body.interests ?? [],
                target_career: body.target_career ?? null,
                password: body.password ?? null, // Manual password storage
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json<ApiResponse<UserProfile>>(
            { success: true, data: data as UserProfile, message: "User profile created or updated." },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[POST /api/user] Detailed Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: (error?.message) || (typeof error === 'string' ? error : JSON.stringify(error)) || "An unexpected error occurred.",
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
    } catch (error: any) {
        console.error("[PATCH /api/user] Detailed Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: (error?.message) || (typeof error === 'string' ? error : JSON.stringify(error)) || "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}
