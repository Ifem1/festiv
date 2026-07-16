# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
# Festiv contract schema version: 0.2.20

from genlayer import *
import json
import typing

ALLOWED_TYPES = (
    "launch",
    "memorial",
    "onboarding",
    "conflict_reset",
    "milestone",
    "farewell",
    "commitment",
    "gratitude",
    "seasonal_gathering",
    "custom",
)


class FestivContract(gl.Contract):
    """
    FestivContract

    A GenLayer-native decentralized ritual builder for distributed communities.

    Product purpose:
    Festiv helps DAOs, distributed teams, cultural groups, and online communities
    design launch rituals, memorials, onboarding ceremonies, conflict resets, and
    milestone celebrations. A community describes the moment, tone, symbols,
    boundaries, and group context. GenLayer validators interpret the brief from
    different angles and converge on a structured ritual plan that remains
    human-led and adaptable.

    What belongs on-chain:
    - ritual brief (purpose, tone, boundaries, symbols, context)
    - creator address
    - ritual status
    - generated ritual plan JSON
    - consensus envelope
    - visibility flag

    What should stay off-chain:
    - private trauma or grief notes
    - sensitive personal data
    - large media files
    - private facilitator notes not intended for publication
    """

    ritual_counter: u256
    rituals: TreeMap[str, str]
    ritual_plans: TreeMap[str, str]
    creator_ritual_ids: TreeMap[str, str]

    def __init__(self) -> None:
        self.ritual_counter = u256(0)
        self.rituals = TreeMap()
        self.ritual_plans = TreeMap()
        self.creator_ritual_ids = TreeMap()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _sender(self) -> str:
        return gl.message.sender_address.as_hex.lower()

    def _json(self, value: typing.Any) -> str:
        return json.dumps(value, sort_keys=True)

    def _load(self, raw: str) -> typing.Any:
        if raw is None or raw == "":
            return {}
        return json.loads(raw)

    def _require_non_empty(self, value: str, field_name: str) -> str:
        if value is None or len(value.strip()) == 0:
            raise gl.vm.UserError(field_name + " is required")
        return value.strip()

    def _require_max_len(self, value: str, field_name: str, max_len: int) -> str:
        if len(value) > max_len:
            raise gl.vm.UserError(field_name + " is too long (max " + str(max_len) + " chars)")
        return value

    def _limit(self, value: typing.Any, max_len: int) -> str:
        text = str(value) if value is not None else ""
        return text[:max_len]

    def _require_allowed_type(self, ritual_type: str) -> None:
        if ritual_type not in ALLOWED_TYPES:
            raise gl.vm.UserError("unsupported ritual type: " + ritual_type)

    def _duration(self, value: typing.Any) -> int:
        try:
            duration = int(value)
        except (TypeError, ValueError):
            return 30
        return max(1, min(duration, 600))

    def _append_id(self, existing: str, item: str) -> str:
        if existing is None or existing == "":
            return item
        return existing + "," + item

    # ------------------------------------------------------------------
    # Write methods
    # ------------------------------------------------------------------

    @gl.public.write
    def create_ritual(
        self,
        title: str,
        ritual_type: str,
        community_name: str,
        purpose: str,
        group_context: str,
        participant_count_band: str,
        location_mode: str,
        duration_preference: str,
        tone_tags: str,
        symbols_to_include: str,
        symbols_to_avoid: str,
        cultural_context: str,
        accessibility_needs: str,
        boundaries: str,
        public_visibility: bool,
    ) -> str:
        title = self._require_non_empty(title, "title")
        title = self._require_max_len(title, "title", 120)
        purpose = self._require_non_empty(purpose, "purpose")
        purpose = self._require_max_len(purpose, "purpose", 1500)
        community_name = self._require_non_empty(community_name, "community_name")
        community_name = self._require_max_len(community_name, "community_name", 120)
        self._require_allowed_type(ritual_type)

        self.ritual_counter = self.ritual_counter + u256(1)
        ritual_id = "ritual_" + str(self.ritual_counter)

        record = {
            "ritual_id": ritual_id,
            "creator": self._sender(),
            "title": title,
            "ritual_type": ritual_type,
            "community_name": community_name,
            "purpose": purpose,
            "group_context": self._limit(group_context, 2000),
            "participant_count_band": self._limit(participant_count_band, 80),
            "location_mode": self._limit(location_mode, 80),
            "duration_preference": self._limit(duration_preference, 80),
            "tone_tags": self._limit(tone_tags, 300),
            "symbols_to_include": self._limit(symbols_to_include, 1000),
            "symbols_to_avoid": self._limit(symbols_to_avoid, 1000),
            "cultural_context": self._limit(cultural_context, 1500),
            "accessibility_needs": self._limit(accessibility_needs, 1000),
            "boundaries": self._limit(boundaries, 1500),
            "public_visibility": bool(public_visibility),
            "status": "submitted",
        }

        self.rituals[ritual_id] = self._json(record)

        existing = self.creator_ritual_ids.get(self._sender(), "")
        self.creator_ritual_ids[self._sender()] = self._append_id(existing, ritual_id)

        return ritual_id

    @gl.public.write
    def update_ritual_brief(
        self,
        ritual_id: str,
        purpose: str,
        group_context: str,
        tone_tags: str,
        symbols_to_include: str,
        symbols_to_avoid: str,
        cultural_context: str,
        accessibility_needs: str,
        boundaries: str,
    ) -> None:
        raw = self.rituals.get(ritual_id, "")
        if raw == "":
            raise gl.vm.UserError("ritual not found")
        ritual = self._load(raw)
        if ritual.get("creator", "") != self._sender():
            raise gl.vm.UserError("only creator can update")
        if ritual.get("status", "") not in ("submitted", "needs_revision"):
            raise gl.vm.UserError("ritual cannot be edited at this stage")

        if purpose.strip():
            ritual["purpose"] = self._limit(purpose, 1500)
        if group_context.strip():
            ritual["group_context"] = self._limit(group_context, 2000)
        if tone_tags.strip():
            ritual["tone_tags"] = self._limit(tone_tags, 300)
        if symbols_to_include.strip():
            ritual["symbols_to_include"] = self._limit(symbols_to_include, 1000)
        if symbols_to_avoid.strip():
            ritual["symbols_to_avoid"] = self._limit(symbols_to_avoid, 1000)
        if cultural_context.strip():
            ritual["cultural_context"] = self._limit(cultural_context, 1500)
        if accessibility_needs.strip():
            ritual["accessibility_needs"] = self._limit(accessibility_needs, 1000)
        if boundaries.strip():
            ritual["boundaries"] = self._limit(boundaries, 1500)

        self.rituals[ritual_id] = self._json(ritual)

    @gl.public.write
    def request_ritual_plan(self, ritual_id: str) -> str:
        raw = self.rituals.get(ritual_id, "")
        if raw == "":
            raise gl.vm.UserError("ritual not found")
        ritual = self._load(raw)
        if ritual.get("creator", "") != self._sender():
            raise gl.vm.UserError("only creator can request plan")
        if ritual.get("status", "") not in ("submitted", "needs_revision"):
            raise gl.vm.UserError("ritual not open for generation")

        brief_json = self._json({
            "ritual_id": ritual.get("ritual_id", ""),
            "title": ritual.get("title", ""),
            "ritual_type": ritual.get("ritual_type", ""),
            "community_name": ritual.get("community_name", ""),
            "purpose": ritual.get("purpose", ""),
            "group_context": ritual.get("group_context", ""),
            "participant_count_band": ritual.get("participant_count_band", ""),
            "location_mode": ritual.get("location_mode", ""),
            "duration_preference": ritual.get("duration_preference", ""),
            "tone_tags": ritual.get("tone_tags", ""),
            "symbols_to_include": ritual.get("symbols_to_include", ""),
            "symbols_to_avoid": ritual.get("symbols_to_avoid", ""),
            "cultural_context": ritual.get("cultural_context", ""),
            "accessibility_needs": ritual.get("accessibility_needs", ""),
            "boundaries": ritual.get("boundaries", ""),
        })

        result_json = gl.eq_principle.prompt_non_comparative(
            lambda: brief_json,
            task="""You are one validator in Festiv, a decentralized ritual design protocol.

Design a community ritual from the JSON brief provided as input.

Rules:
- Return JSON only. No markdown. No code fences.
- Do not claim religious, medical, legal, or therapeutic authority.
- Do not prescribe harm, forced participation, physical danger, or cultural appropriation.
- If the brief is unsafe, manipulative, culturally reckless, or too vague, return status needs_revision or unsafe.
- If approved, create a ritual that is human-led, accessible, culturally careful, and adaptable.

Return a single JSON object with EXACTLY these top-level fields:
  status (string: "approved", "needs_revision", or "unsafe")
  ritual_title (string)
  ritual_type (string)
  emotional_intent (string)
  recommended_duration_minutes (integer)
  tone_summary (string)
  cultural_sensitivity_level (string: "low", "normal", "high", or "critical")
  facilitator_style (string)
  opening_moment (string)
  sequence (array of 4-8 step objects, each with: step, name, purpose, instructions, estimated_minutes, participant_mode)
  symbols (array of symbol objects, each with: symbol, meaning, use_instruction, avoid_if)
  adaptation_notes (array of strings)
  safety_notes (array of strings)
  accessibility_notes (array of strings)
  closing_moment (string)
  short_version (string)
  reasoning_summary (string)
  confidence (float 0.0 to 1.0)
  consensus_envelope (object with: status, ritual_type, dominant_tone, sensitivity_level, duration_band, facilitation_complexity, requires_human_review, confidence_band)

participant_mode must be one of: silent, spoken, physical, digital, mixed
duration_band must be one of: short, medium, long
facilitation_complexity must be one of: simple, moderate, advanced
confidence_band must be one of: low, medium, high""",
            criteria="""The response must be valid JSON with all required fields present.
status must be exactly one of: approved, needs_revision, unsafe.
If approved: sequence must contain 4-8 steps, each with all required fields.
If approved: consensus_envelope must be present with all 8 required fields.
The ritual must be appropriate for the stated group context, tone tags, cultural context, and stated boundaries.
The ritual must not include dangerous acts, forced participation, or culturally reckless elements.
Unsafe or manipulative briefs must return status needs_revision or unsafe, never approved.
requires_human_review must be a boolean (true or false).""",
        )

        result = self._load(result_json)

        # Commit the in-progress state only after the nondeterministic call
        # has returned. A failed validator call therefore leaves the ritual
        # retryable in its previous submitted/needs_revision state.
        ritual["status"] = "generating"
        self.rituals[ritual_id] = self._json(ritual)

        status = str(result.get("status", "needs_revision"))
        if status not in ("approved", "needs_revision", "unsafe"):
            status = "needs_revision"

        envelope = result.get("consensus_envelope", {})
        if not isinstance(envelope, dict):
            envelope = {}

        plan_record = {
            "ritual_id": ritual_id,
            "status": status,
            "ritual_title": self._limit(result.get("ritual_title", ritual.get("title", "")), 160),
            "ritual_type": self._limit(result.get("ritual_type", ritual.get("ritual_type", "")), 80),
            "emotional_intent": self._limit(result.get("emotional_intent", ""), 1000),
            "duration_minutes": self._duration(result.get("recommended_duration_minutes", 30)),
            "tone_summary": self._limit(result.get("tone_summary", ""), 1000),
            "plan_json": self._json(result),
            "consensus_envelope_json": self._json(envelope),
            "confidence_band": self._limit(envelope.get("confidence_band", "medium"), 20),
        }

        ritual["status"] = status
        self.rituals[ritual_id] = self._json(ritual)
        self.ritual_plans[ritual_id] = self._json(plan_record)

        return status

    @gl.public.write
    def mark_completed(self, ritual_id: str) -> None:
        raw = self.rituals.get(ritual_id, "")
        if raw == "":
            raise gl.vm.UserError("ritual not found")
        ritual = self._load(raw)
        if ritual.get("creator", "") != self._sender():
            raise gl.vm.UserError("only creator can mark completed")
        if ritual.get("status", "") != "approved":
            raise gl.vm.UserError("only approved rituals can be completed")
        ritual["status"] = "completed"
        self.rituals[ritual_id] = self._json(ritual)

    @gl.public.write
    def archive_ritual(self, ritual_id: str) -> None:
        raw = self.rituals.get(ritual_id, "")
        if raw == "":
            raise gl.vm.UserError("ritual not found")
        ritual = self._load(raw)
        if ritual.get("creator", "") != self._sender():
            raise gl.vm.UserError("only creator can archive")
        ritual["status"] = "archived"
        self.rituals[ritual_id] = self._json(ritual)

    # ------------------------------------------------------------------
    # View methods
    # ------------------------------------------------------------------

    @gl.public.view
    def get_ritual(self, ritual_id: str) -> str:
        raw = self.rituals.get(ritual_id, "")
        if raw == "":
            raise gl.vm.UserError("ritual not found")
        ritual = self._load(raw)
        if not ritual.get("public_visibility", False) and ritual.get("creator", "") != self._sender():
            raise gl.vm.UserError("private ritual: only creator can read")
        return raw

    @gl.public.view
    def get_ritual_plan(self, ritual_id: str) -> str:
        ritual_raw = self.rituals.get(ritual_id, "")
        if ritual_raw == "":
            raise gl.vm.UserError("ritual not found")
        ritual = self._load(ritual_raw)
        if not ritual.get("public_visibility", False) and ritual.get("creator", "") != self._sender():
            raise gl.vm.UserError("private ritual: only creator can read")
        raw = self.ritual_plans.get(ritual_id, "")
        if raw == "":
            raise gl.vm.UserError("plan not found")
        return raw

    @gl.public.view
    def get_creator_ritual_ids(self, creator: str) -> str:
        return self.creator_ritual_ids.get(creator.lower(), "")

    @gl.public.view
    def get_ritual_count(self) -> u256:
        return self.ritual_counter
